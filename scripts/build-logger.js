const fs = require('fs');
const path = require('path');
const util = require('util');

class BuildLogger {
    constructor() {
        this.logDir = path.join(process.cwd(), 'logs');
        this.logFile = path.join(this.logDir, `build-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    log(message, type = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type}] ${message}\n`;
        
        // Write to file
        fs.appendFileSync(this.logFile, logMessage);
        
        // Also output to console with colors
        const colors = {
            INFO: '\x1b[36m',    // Cyan
            ERROR: '\x1b[31m',   // Red
            WARN: '\x1b[33m',    // Yellow
            SUCCESS: '\x1b[32m'  // Green
        };
        const reset = '\x1b[0m';
        console.log(`${colors[type] || ''}${logMessage}${reset}`);
    }

    error(message) {
        this.log(message, 'ERROR');
    }

    warn(message) {
        this.log(message, 'WARN');
    }

    success(message) {
        this.log(message, 'SUCCESS');
    }

    logBuildInfo() {
        this.log('Build Environment Information:');
        this.log(`Node Version: ${process.version}`);
        this.log(`Platform: ${process.platform}`);
        this.log(`Architecture: ${process.arch}`);
        this.log(`Working Directory: ${process.cwd()}`);
        this.log(`Environment: ${process.env.NODE_ENV}`);
    }

    logMemoryUsage() {
        const used = process.memoryUsage();
        for (let key in used) {
            this.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
        }
    }

    async logDiskSpace() {
        const { exec } = require('child_process');
        const execAsync = util.promisify(exec);
        
        try {
            const { stdout } = await execAsync('df -h .');
            this.log(`Disk Space:\n${stdout}`);
        } catch (error) {
            this.warn(`Could not get disk space info: ${error.message}`);
        }
    }

    startTimer(label) {
        if (!this.timers) this.timers = {};
        this.timers[label] = process.hrtime();
    }

    endTimer(label) {
        if (!this.timers || !this.timers[label]) {
            this.warn(`No timer found for: ${label}`);
            return;
        }
        
        const diff = process.hrtime(this.timers[label]);
        const time = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert to milliseconds
        this.log(`${label} took ${time.toFixed(2)}ms`);
        delete this.timers[label];
    }
}

module.exports = new BuildLogger();
