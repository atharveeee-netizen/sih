#!/usr/bin/env python3
"""
BEEVIL KNIEVEL / HONEYCHAIN — BIO-ACOUSTIC AUDIO SYNTHESIZER
===========================================================
Generates 3 authentic synthetic bio-acoustic WAV audio samples for SIH jury playback:
1. 220Hz_Queenright_Normal_Hum.wav       (220 Hz + natural wingbeat harmonics)
2. 450Hz_Pre_Swarm_Harmonic_Surge.wav   (450 Hz frequency-modulated swarm surge)
3. 680Hz_Varroa_Grooming_Distress.wav   (680 Hz high-frequency mite distress pulses)

Uses standard library 'wave', 'struct', and 'math' with zero external dependencies.
"""

import os
import math
import struct
import wave
import random

SAMPLE_RATE = 44100  # 44.1 kHz Standard CD Quality
DURATION_SEC = 5.0   # 5-second clean loops

def generate_queenright_normal_hum(filename: str):
    """220 Hz Queen-Right Colony Flight Hum with natural wingbeat harmonics and air turbulence."""
    num_samples = int(SAMPLE_RATE * DURATION_SEC)
    with wave.open(filename, "w") as wav_file:
        wav_file.setnchannels(1)        # Mono
        wav_file.setsampwidth(2)        # 16-bit PCM
        wav_file.setframerate(SAMPLE_RATE)
        
        frames = bytearray()
        for i in range(num_samples):
            t = i / SAMPLE_RATE
            
            # Fundamental: 220 Hz (Queen-right baseline)
            s1 = 0.50 * math.sin(2.0 * math.pi * 220.0 * t)
            # 2nd Harmonic: 440 Hz
            s2 = 0.25 * math.sin(2.0 * math.pi * 440.0 * t + 0.3)
            # 3rd Harmonic: 660 Hz
            s3 = 0.12 * math.sin(2.0 * math.pi * 660.0 * t + 0.7)
            # Colony flutter modulation (5 Hz amplitude wobble)
            flutter = 0.85 + 0.15 * math.sin(2.0 * math.pi * 5.0 * t)
            # Ambient colony air cavity noise
            noise = (random.random() - 0.5) * 0.05
            
            sample_val = (s1 + s2 + s3 + noise) * flutter
            sample_val = max(-1.0, min(1.0, sample_val))
            packed = struct.pack("<h", int(sample_val * 32767.0))
            frames.extend(packed)
            
        wav_file.writeframes(frames)
    print(f" [OK] Generated: {filename}")

def generate_swarm_surge(filename: str):
    """450 Hz Pre-Swarm Harmonic Escalation with rapid 12 Hz flight agitation."""
    num_samples = int(SAMPLE_RATE * DURATION_SEC)
    with wave.open(filename, "w") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        
        frames = bytearray()
        for i in range(num_samples):
            t = i / SAMPLE_RATE
            
            # Frequency modulation between 420 Hz and 480 Hz
            inst_freq = 450.0 + 30.0 * math.sin(2.0 * math.pi * 8.0 * t)
            s1 = 0.55 * math.sin(2.0 * math.pi * inst_freq * t)
            s2 = 0.30 * math.sin(2.0 * math.pi * (inst_freq * 2.0) * t)
            # Intense collective buzzing agitation (12 Hz AM)
            agitation = 0.75 + 0.25 * math.sin(2.0 * math.pi * 12.0 * t)
            noise = (random.random() - 0.5) * 0.08
            
            sample_val = (s1 + s2 + noise) * agitation
            sample_val = max(-1.0, min(1.0, sample_val))
            packed = struct.pack("<h", int(sample_val * 32767.0))
            frames.extend(packed)
            
        wav_file.writeframes(frames)
    print(f" [OK] Generated: {filename}")

def generate_varroa_distress(filename: str):
    """680 Hz High-Pitched Varroa Mite Grooming & Parasitic Distress Pulses."""
    num_samples = int(SAMPLE_RATE * DURATION_SEC)
    with wave.open(filename, "w") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        
        frames = bytearray()
        for i in range(num_samples):
            t = i / SAMPLE_RATE
            
            # High-pitched 680 Hz distress whine
            s1 = 0.50 * math.sin(2.0 * math.pi * 680.0 * t)
            # Sharp harmonic 1360 Hz
            s2 = 0.35 * math.sin(2.0 * math.pi * 1360.0 * t + 0.5)
            # 2040 Hz micro-whistle
            s3 = 0.15 * math.sin(2.0 * math.pi * 2040.0 * t)
            # Grooming distress pulsed bursts (4 Hz sharp modulation)
            pulse = math.pow(math.sin(2.0 * math.pi * 4.0 * t), 4)
            noise = (random.random() - 0.5) * 0.06
            
            sample_val = (s1 + s2 + s3 + noise) * (0.3 + 0.7 * pulse)
            sample_val = max(-1.0, min(1.0, sample_val))
            packed = struct.pack("<h", int(sample_val * 32767.0))
            frames.extend(packed)
            
        wav_file.writeframes(frames)
    print(f" [OK] Generated: {filename}")

def main():
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "audio_samples")
    os.makedirs(out_dir, exist_ok=True)
    
    f1 = os.path.join(out_dir, "220Hz_Queenright_Normal_Hum.wav")
    f2 = os.path.join(out_dir, "450Hz_Pre_Swarm_Harmonic_Surge.wav")
    f3 = os.path.join(out_dir, "680Hz_Varroa_Grooming_Distress.wav")
    
    print("[*] Generating 3 Bio-Acoustic Audio Samples for SIH Presentation...")
    generate_queenright_normal_hum(f1)
    generate_swarm_surge(f2)
    generate_varroa_distress(f3)
    print(f"\n[+] All 3 audio files successfully written to: {os.path.abspath(out_dir)}")

if __name__ == "__main__":
    main()
