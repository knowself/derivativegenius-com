#!/usr/bin/env tsx

/**
 * DG CLI - The Derivative Genius Dev Kit
 * Usage: dg [command] [args]
 * 
 * Commands:
 *   doctor   - Audit environment health (Env vars, dependencies, files)
 *   dev      - Start development server with optional tunnel or local fallback
 *   help     - Print usage and command list
 */

import 'dotenv/config';
import minimist from 'minimist';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { spawn, execSync } from 'child_process';

// Load .env.local override if it exists
dotenv.config({ path: '.env.local', override: true });

const args = minimist(process.argv.slice(2));
const command = args._[0];

async function main() {
    console.log(`🤖 Derivative Genius Dev Kit (dg-cli) v1.0.0`);

    if (!command || command === 'help' || args.help || args.h) {
        printHelp();
        return;
    }

    switch (command) {
        case 'doctor':
            await runDoctor();
            break;
        case 'dev':
            await runDev();
            break;
        default:
            console.error(`❌ Unknown command: ${command}`);
            printHelp();
            process.exit(1);
    }
}

function printHelp() {
    console.log(`
Usage:
  dg [command] [args] [flags]

Commands:
  dev              Start Dev Server (auto-tunnels via ngrok if available, or falls back to local)
  doctor           Audit environment configuration and health
  help             Display this help message

Flags for 'dev':
  --no-tunnel, --local   Skip tunnel attempt and run directly on localhost

Examples:
  dg dev
  dg dev --no-tunnel
  dg doctor
  dg help
  `);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractTunnelUrl(output: string) {
    const match = output.match(/https:\/\/[^\s"']*(?:ngrok|ngrok-free)[^\s"']*/i);
    return match?.[0] ?? '';
}

function resolveNgrokBinary() {
    const localBinary = path.join(
        process.cwd(),
        'node_modules',
        '.bin',
        process.platform === 'win32' ? 'ngrok.cmd' : 'ngrok',
    );

    return fs.existsSync(localBinary) ? localBinary : 'ngrok';
}

// --- COMMANDS ---

async function runDev() {
    console.log('🚀 Starting Derivative Genius Development Environment...');

    const port = 3000;
    const noTunnel = args['no-tunnel'] || args.local;
    let tunnelUrl = `http://localhost:${port}`;
    let ngrokProc: any = null;

    if (noTunnel) {
        console.log(`ℹ️ Tunnel disabled via flag. Operating in local mode on port ${port}...`);
    } else {
        console.log(`📡 Attempting public tunnel to port ${port} (via ngrok binary)...`);

        let ngrokExited = false;
        let ngrokSpawnError = '';
        let ngrokStdout = '';
        let ngrokStderr = '';
        const ngrokBinary = resolveNgrokBinary();
        let ngrokAvailable = false;

        try {
            if (ngrokBinary === 'ngrok') {
                execSync('which ngrok', { stdio: 'ignore' });
            }
            ngrokAvailable = true;
        } catch {
            console.warn('⚠️ ngrok binary not found on PATH or node_modules.');
        }

        if (ngrokAvailable) {
            // Kill any existing ngrok
            try { execSync('pkill ngrok'); } catch { }

            ngrokProc = spawn(ngrokBinary, ['http', port.toString(), '--log=stdout', '--host-header=rewrite'], {
                stdio: ['ignore', 'pipe', 'pipe']
            });

            ngrokProc.on('error', (error: any) => {
                ngrokSpawnError = error.message;
            });

            ngrokProc.on('exit', () => {
                ngrokExited = true;
            });

            ngrokProc.stdout?.on('data', (chunk: any) => {
                ngrokStdout += chunk.toString();
                const parsedUrl = extractTunnelUrl(ngrokStdout);
                if (parsedUrl) tunnelUrl = parsedUrl;
            });

            ngrokProc.stderr?.on('data', (chunk: any) => {
                ngrokStderr += chunk.toString();
                const parsedUrl = extractTunnelUrl(ngrokStderr);
                if (parsedUrl) tunnelUrl = parsedUrl;
            });

            await sleep(1200);

            for (let attempt = 0; attempt < 4 && tunnelUrl === `http://localhost:${port}`; attempt++) {
                if (ngrokExited || ngrokSpawnError) break;

                try {
                    const res = await fetch('http://127.0.0.1:4040/api/tunnels');
                    if (res.ok) {
                        const data: any = await res.json();
                        const publicUrl = data.tunnels?.[0]?.public_url;
                        if (publicUrl) {
                            tunnelUrl = publicUrl;
                            break;
                        }
                    }
                } catch {
                    // retry
                }

                await sleep(500);
            }
        }

        if (tunnelUrl === `http://localhost:${port}`) {
            console.warn(`\n⚠️ Public ngrok tunnel unavailable or failed.`);
            if (ngrokStderr.trim()) {
                console.warn(`   Reason: ${ngrokStderr.trim().split('\n')[0]}`);
            }
            console.warn(`   ➡️ Operating gracefully in local dev mode: ${tunnelUrl}\n`);
            if (ngrokProc) {
                try { ngrokProc.kill(); } catch { }
            }
        } else {
            console.log(`\n✅ Public URL Active: \x1b[32m${tunnelUrl}\x1b[0m`);
            console.log(`   (Injecting into NEXT_PUBLIC_APP_URL)`);
        }
    }

    // Update .env.local with active URL (whether local or ngrok)
    try {
        const envLocalPath = path.join(process.cwd(), '.env.local');
        let envContent = '';

        if (fs.existsSync(envLocalPath)) {
            envContent = fs.readFileSync(envLocalPath, 'utf-8');
        }

        const key = 'NEXT_PUBLIC_APP_URL';
        const regex = new RegExp(`^${key}=.*$`, 'm');

        if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}=${tunnelUrl}`);
        } else {
            envContent += `\n${key}=${tunnelUrl}\n`;
        }

        fs.writeFileSync(envLocalPath, envContent.trim() + '\n');
        console.log(`   📝 Updated .env.local with active URL (${tunnelUrl}).`);

    } catch (e: any) {
        console.warn(`   ⚠️ Failed to update .env.local: ${e.message}`);
    }

    // Start Next.js with Env Var
    const env = {
        ...process.env,
        NEXT_PUBLIC_APP_URL: tunnelUrl,
        NODE_ENV: 'development' as const
    };

    console.log('⚡ Starting Next.js Dev Server...\n');

    const nextDev = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        env
    });

    const cleanup = () => {
        console.log('\n🛑 Shutting down...');
        if (ngrokProc) {
            try { ngrokProc.kill(); } catch { }
        }
        nextDev.kill();
        process.exit();
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Derivative Genius Dev Environment Ready!');
    console.log('='.repeat(60));
    console.log(`📱 App URL:      ${tunnelUrl}`);
    if (tunnelUrl.includes('ngrok')) {
        console.log(`📊 ngrok:        http://localhost:4040 (inspection)`);
    }
    console.log('='.repeat(60));
    console.log('\n💡 Press Ctrl+C to stop all services\n');
}

async function runDoctor() {
    console.log('\n🩺 Running System Diagnosis for Derivative Genius...\n');
    let failures = 0;

    console.log('1️⃣  Environment Variables');
    const optionalVars = ['NEXT_PUBLIC_APP_URL', 'NODEMAILER_EMAIL'];
    for (const v of optionalVars) {
        if (process.env[v]) {
            console.log(`   ✅ ${v}`);
        } else {
            console.log(`   ℹ️  ${v} is not set (Optional/Dynamic)`);
        }
    }

    console.log('\n2️⃣  File System');
    if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
        console.log('   ✅ .env.local exists');
    } else {
        console.log('   ⚠️  .env.local is missing (Run `dg dev` to auto-start)');
    }

    if (fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
        console.log('   ✅ node_modules exists');
    } else {
        console.log('   ❌ node_modules is missing (Run `npm install`)');
        failures++;
    }

    console.log('\n3️⃣  CLI Dependencies');
    try {
        const ngrokBinary = resolveNgrokBinary();
        if (ngrokBinary === 'ngrok') {
            execSync('which ngrok', { stdio: 'ignore' });
            console.log('   ✅ ngrok found on PATH');
        } else {
            console.log(`   ✅ ngrok found locally at ${ngrokBinary}`);
        }
    } catch {
        console.log('   ℹ️  ngrok is missing from PATH (Optional; `dg dev` will operate in local mode)');
    }

    console.log('\n' + '-'.repeat(30));
    if (failures === 0) {
        console.log('🎉 System is HEALTHY. Derivative Genius Dev Kit is ready.');
    } else {
        console.log(`🚨 System has ${failures} critical issues. Please fix them before development.`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('❌ Fatal Error:', err);
    process.exit(1);
});
