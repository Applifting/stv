import { readFileSync } from 'fs';
import { Vote } from '../model';
import { repeat } from '../utils';


// Data taken from: https://www.opavote.com/results/5654402576678912/2

export function getExampleElectionData(): { candidates: string[], votes: Vote[], seatsToFill: number } {

  const candidates = [
    "Steve Jobs",
    "Elon Musk",
    "Bill Gates",
    "Warren Buffet",
    "Richard Branson"];



  const votes: Vote[] = [];

  const ballots = readFileSync('./src/examples/visionaries.ballots.txt');
  const lines = ballots.toString().split("\n").map(l => l.trim()).filter(l => l != "");
  lines.forEach(l => {
    const line = l.split(" ");
    let vote: Vote = {
      preferences: [],
      weight: 1
    }
    for (let i = 1; i < line.length - 1; i++) {
      vote.preferences.push(candidates[Number.parseInt(line[i]) - 1]);
    }
    votes.push(vote);

  });


  return {
    candidates: candidates,
    votes: votes,
    seatsToFill: 2
  }
}

