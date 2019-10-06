import { getWinQuota, countVotesForCandidate, max, stv, min } from "./stv";
import { getExampleElectionData, chocolateSymbol } from './examples/stv.fruit.example';
import { getExampleElectionData as getNameExampleElectionData } from './examples/stv.counting.example';
import { getExampleElectionData as getDroopExampleElectionData } from './examples/stv.droop.example';
import { getExampleElectionData as getMeekExampleElectionData } from './examples/stv.meek.example';
import { getExampleElectionData as getVisionariesExampleElectionData } from './examples/stv.visionaries.example';

describe('#getWinQuota', () => {
  it('returns the correct votes', () => {
    expect(getWinQuota(20, 3, false)).toBe(6);
    expect(getWinQuota(20, 3, true)).toBe(5);
  });

  it('returns the correct number of elected according to Fruit example from Wiki', () => {
    const data = getExampleElectionData();
    expect(getWinQuota(data.votes.length, data.seatsToFill, false)).toBe(6);
  });

  it('returns the correct number of elected according to Name example from Wiki', () => {
    const data = getNameExampleElectionData();
    expect(getWinQuota(data.votes.length, data.seatsToFill, false)).toBe(20);
  });

  it('returns the correct number of elected according to Droop example from Wiki', () => {
    const data = getDroopExampleElectionData();
    expect(getWinQuota(data.votes.length, data.seatsToFill, false)).toBe(34);
  });

  it('returns the correct number of elected according to Meek example from OpaVote', () => {
    const data = getMeekExampleElectionData();
    expect(getWinQuota(data.votes.length, data.seatsToFill, false)).toBe(16);
  });
});

describe('#countVotesForCandidate', () => {
  it('counts correctly first round from wiki example', () => {
    const data = getExampleElectionData();
    const tally = countVotesForCandidate(data.candidates, data.votes);
    expect(tally).toEqual({ Orange: 4, Pear: 2, Chocolate: 12, Strawberry: 1, Candy: 1 });
  });

  it('counts correctly the votes of chocolate', () => {
    const data = getExampleElectionData();
    const tally = countVotesForCandidate(data.candidates, data.votes, chocolateSymbol);
    expect(tally).toEqual({ Orange: 0, Pear: 0, Chocolate: 0, Strawberry: 8, Candy: 4 });
  });
})

describe('#max', () => {
  it('returns the correct max', () => {
    let tally = { Orange: 4, Pear: 2, Chocolate: 12, Strawberry: 1, Candy: 1 };
    expect(max(tally)).toEqual({ candidate: 'Chocolate', votesCount: 12 });
    tally = { Orange: 26, Pear: 2, Chocolate: 12, Strawberry: 1, Candy: 1 };
    expect(max(tally)).toEqual({ candidate: 'Orange', votesCount: 26 });
  });
});

describe('#min', () => {
  let tally = { Orange: 4, Pear: 2, Chocolate: 12, Strawberry: 1, Candy: 1 };
  expect(min(tally)).toEqual({ candidate: 'Strawberry', votesCount: 1 });
})


describe('#stv', () => {
  it('runs the stv on the fruit example', () => {
    const data = getExampleElectionData();
    const result = stv({ seatsToFill: data.seatsToFill, candidates: data.candidates, votes: data.votes });
    expect(result.validVotesCount).toEqual(20);
    expect(result.winQuota).toEqual(6);
    expect(result.winners).toEqual(['Chocolate', 'Orange', 'Strawberry']);
  });

  it('runs the stv on the name example', () => {
    const data = getNameExampleElectionData();
    const result = stv({ seatsToFill: data.seatsToFill, candidates: data.candidates, votes: data.votes });
    expect(result.validVotesCount).toEqual(57);
    expect(result.winQuota).toEqual(20);
    expect(result.winners).toEqual(['Andrea', 'Carter']);
  });

  it('runs the stv on the Droop example', () => {
    const data = getDroopExampleElectionData();
    const result = stv({ seatsToFill: data.seatsToFill, candidates: data.candidates, votes: data.votes });
    expect(result.validVotesCount).toEqual(100);
    expect(result.winQuota).toEqual(34);
    expect(result.winners).toEqual(['Andrea', 'Carter']);
  });

  // We actually do not use Meek, but it plays out the same in this example
  it('runs the stv on the Meek example', () => {
    const data = getMeekExampleElectionData();
    const result = stv({ seatsToFill: data.seatsToFill, candidates: data.candidates, votes: data.votes });
    expect(result.validVotesCount).toEqual(60);
    expect(result.winQuota).toEqual(16);
    expect(result.winners).toEqual(['Alice', 'Bob', 'Chris']);
  });

  it('runs the stv on the Scottish example', () => {
    const data = getVisionariesExampleElectionData();
    const result = stv({ seatsToFill: data.seatsToFill, candidates: data.candidates, votes: data.votes });
    expect(result.validVotesCount).toEqual(5920);
    expect(result.winQuota).toEqual(1974);
    expect(result.winners).toEqual(['Steve Jobs', 'Bill Gates']);

    //Check tallies
    expect(result.rounds[0].runningTally).toEqual({
      'Steve Jobs': 1418,
      'Elon Musk': 1184,
      'Bill Gates': 1283,
      'Warren Buffet': 990,
      'Richard Branson': 1045
    });
    expect(result.rounds[3].runningTally['Elon Musk']).toBeCloseTo(1708.29186);
    expect(result.rounds[3].runningTally['Bill Gates']).toBeCloseTo(1991.785645);
  });
});