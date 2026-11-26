// Texts From Your Future Self — entry program.
// Writes one line (1-200 chars), a text from the user's future self, to
// /output/entry.txt.
// The text: the backup you keep meaning to make never gets made — and the
// future self is writing from inside the data loss.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MAX = 200;

function buildText(): string {
  const greeting = "Hey, it's future you.";
  const warning = "The backup you keep meaning to make? You never make it.";
  const punch = "I am writing this from the data loss.";
  return [greeting, warning, punch].join(" ");
}

function guard(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > MAX) {
    throw new Error(`text fails the 1-${MAX} character gate (${chars})`);
  }
  if (line.includes("\n")) {
    throw new Error("text must be a single line");
  }
  // It must be a text from the future self, addressed to you.
  if (!/^Hey, it's future you\./.test(line)) {
    throw new Error("text must open as the future self");
  }
  // The warning must name the backup that never gets made.
  if (!/The backup you keep meaning to make\? You never make it\./.test(line)) {
    throw new Error("text must carry the backup that never gets made");
  }
  // The punch lands last: writing from the data loss.
  if (!/I am writing this from the data loss\.$/.test(line)) {
    throw new Error("text must end on the data loss");
  }
  // Four beats in text order: greeting, warning question, warning answer, punch.
  const beats = line.split(/(?<=\.)\s+|(?<=\?)\s+/);
  if (beats.length !== 4 || !/^Hey, it's future you\./.test(beats[0]) || !/You never make it\./.test(beats[2])) {
    throw new Error("text must be greeting plus warning plus punch");
  }
}

const line = buildText();
guard(line);
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
mkdirSync(outDir, { recursive: true });
const target = resolve(outDir, "entry.txt");
writeFileSync(target, new TextEncoder().encode(line));
console.log(`wrote ${[...line].length} chars to ${target}`);
