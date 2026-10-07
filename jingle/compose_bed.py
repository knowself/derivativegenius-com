#!/usr/bin/env python3
"""
Derivative Genius jingle bed composer — 100% open-source synthesis.
No samples, no GPU, no cloud. numpy + ffmpeg only. You own every note.

Usage:
    python3 compose_bed.py [--key C] [--bpm 120] [--out name]

Outputs <out>-bed.mp3 and <out>-guide.mp3 (guide = bed + synth vocal melody).
"""
import argparse, numpy as np, subprocess, os, wave

SR = 44100
KEYS = {'C': 0, 'G': 7, 'D': 2, 'A': 9, 'E': 4, 'F': 5, 'Bb': 10}

def midi(m): return 440.0 * 2 ** ((m - 69) / 12.0)

def piano(freq, dur):
    n = int(SR * dur); tt = np.arange(n) / SR
    env = np.exp(-tt * 4.5) * np.minimum(1, tt * 200)
    return (np.sin(2*np.pi*freq*tt) + 0.45*np.sin(2*np.pi*2*freq*tt)*np.exp(-tt*6)
            + 0.22*np.sin(2*np.pi*3*freq*tt)*np.exp(-tt*9)
            + 0.10*np.sin(2*np.pi*4.01*freq*tt)*np.exp(-tt*12)) * env

def bass_note(freq, dur):
    n = int(SR * dur); tt = np.arange(n) / SR
    env = np.exp(-tt * 6) * np.minimum(1, tt * 300)
    return (np.sin(2*np.pi*freq*tt) + 0.3*np.sin(2*np.pi*2*freq*tt)) * env

def kick():
    n = int(SR * 0.14); tt = np.arange(n) / SR
    f = 160 * np.exp(-tt * 30) + 45
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-tt * 28)

def snare():
    n = int(SR * 0.16); tt = np.arange(n) / SR
    nz = np.random.default_rng(7).standard_normal(n)
    return (0.6*nz*np.exp(-tt*40) + 0.4*np.sin(2*np.pi*190*tt)*np.exp(-tt*35)) * 0.7

def hat(open_=False):
    d = 0.09 if open_ else 0.035
    n = int(SR * d); tt = np.arange(n) / SR
    nz = np.random.default_rng(11).standard_normal(n)
    hp = np.concatenate([[0], nz[1:] - 0.96*nz[:-1]])
    return hp * np.exp(-tt * (60 if not open_ else 25)) * 0.35

def lead(freq, dur):
    n = int(SR * dur); tt = np.arange(n) / SR
    vib = 1 + 0.006*np.sin(2*np.pi*5.5*tt)
    env = np.clip(np.minimum(1, tt*40) * np.minimum(1, (dur-tt)*8 + 0.001), 0, 1)
    return (np.sin(2*np.pi*freq*vib*tt) + 0.25*np.sin(2*np.pi*2*freq*tt)) * env * 0.8

def place(buf, sig, beat, BEAT):
    i = int(beat * BEAT * SR); j = min(len(buf), i + len(sig))
    if i < len(buf): buf[i:j] += sig[:j-i]

# Default composition: Derivative Genius jingle, C major, 120 BPM.
# Melody = (midi, start_beat, dur_beats); transpose via --key.
MEL = [
    (64,0,1),(67,1,1),(69,2,.5),(67,2.5,.5),(69,3,.5),(67,3.5,.5),
    (64,4,1),(62,5,1),(64,6,.5),(60,6.5,1.5),
    (65,8,.5),(69,8.5,.5),(72,9,1),(69,10,.5),(67,10.5,.5),(69,11,.5),
    (72,11.5,.5),(74,12,1),(72,13,1),(69,14,.5),(67,14.5,.5),(69,15,.5),
    (72,15.5,.5),(74,16,1),(72,17,1),(71,18,.5),(69,18.5,.5),(67,19,1),
    (69,20,2),
    (67,22,.5),(69,22.5,1),(71,23.5,.5),(72,24,1),(74,25,.5),
    (72,25.5,1.5),(74,27,3),
]
CHORDS = [  # (root_midi, start_beat, dur_beats, intervals)
    (48,0,4,[0,4,7]),(41,4,2,[0,4,7]),(48,6,2,[0,4,7]),
    (41,8,4,[0,4,7]),(48,12,4,[0,4,7]),(43,16,4,[0,4,7]),
    (48,20,2,[0,4,7]),(41,22,4,[0,4,7]),(43,26,2,[0,4,7]),(48,28,2,[0,4,7]),
]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--key', default='C', choices=KEYS.keys())
    ap.add_argument('--bpm', type=float, default=120)
    ap.add_argument('--out', default='dg-jingle')
    a = ap.parse_args()
    tp = KEYS[a.key]; BEAT = 60.0 / a.bpm; DUR = 15.0; N = int(SR * DUR)
    bed = np.zeros(N); vox = np.zeros(N)
    for root, sb, db, iv in CHORDS:
        for i_ in iv: place(bed, piano(midi(root+12+i_+tp), db*BEAT)*0.30, sb, BEAT)
        b = sb
        while b < sb + db - 1e-6:
            place(bed, bass_note(midi(root+tp), 0.42)*0.5, b, BEAT); b += 1
    b = 0
    while b < 30:
        if b % 2 == 0: place(bed, kick()*0.9, b, BEAT)
        else: place(bed, snare()*0.8, b, BEAT)
        place(bed, hat()*0.8, b, BEAT); place(bed, hat()*0.6, b+0.5, BEAT); b += 1
    place(bed, kick()*1.0, 28, BEAT); place(bed, snare()*0.9, 28, BEAT)
    for m, sb, db in MEL: place(vox, lead(midi(m+tp), db*BEAT), sb, BEAT)
    os.makedirs(os.path.expanduser('~/workspace/your_files/jingle'), exist_ok=True)
    for name, mix in [(a.out+'-bed', bed), (a.out+'-guide', bed+vox)]:
        mix = mix / max(1e-6, np.abs(mix).max()) * 0.89
        f = int(SR*0.4); mix[-f:] *= np.linspace(1, 0, f)
        mix = np.tanh(mix*1.1)
        wav = f'/tmp/{name}.wav'
        w = wave.open(wav,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
        mp3 = os.path.expanduser(f'~/workspace/your_files/jingle/{name}.mp3')
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wav,'-codec:a','libmp3lame','-b:a','192k',mp3], check=True)
        print('wrote', mp3)

if __name__ == '__main__': main()
