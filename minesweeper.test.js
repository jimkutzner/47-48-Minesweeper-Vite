import { describe, expect, it, beforeEach, afterEach, vi, test } from "vitest"
import { defineConfig } from "vite";
import { sums } from 'minesweeper.js'
import {
  createBoard,
  TILE_STATUSES,
  markedTilesCount,
  markTile,
  revealTile,
  checkWin,
  checkLose,
  positionMatch,
} from "./minesweeper"

// test routine
describe('sums', () => {
  it('returns a sum', () => {    
    expect(sums()).toBe(0)
  })
  it('returns a sum', () => {
    expect(sums(2)).toBe(2)
  })
  it('returns a sum', () => {
    expect(sums(1, 2, 3, 4)).toBe(10)
  })
})

// test minesweeper
describe('#createBoard', () => {
  it('creates a board', () => {
    const boardSize = 2
    const minePositions = [{ x: 0, y: 1 }]
    const newBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false},
      ]
    ]
    const board = createBoard(boardSize, minePositions)
    expect(board).toEqual(newBoard)
  })
})

describe('#markedTilesCount', () => {
  it('tests for marked tiles', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.MARKED, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false},
      ]
    ]
    expect(markedTilesCount(board)).toEqual(2)
  })

  it('tests for no marked tiles', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false},
      ]
    ]
    expect(markedTilesCount(board)).toEqual(0)
  })

  it('tests for all marked tiles', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.MARKED, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.MARKED, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.MARKED, mine: false},
      ]
    ]
    expect(markedTilesCount(board)).toEqual(4)
  })
})

describe('#markTile', () => {
  it('marks a tile', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false},
      ]
    ]
    const newBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.MARKED, mine: false},
      ]
    ]
    expect(markTile(board, {x: 1, y: 1})).toEqual(newBoard)
  })

  it('unmarks a tile', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.MARKED, mine: false},
      ]
    ]
    const newBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false},
      ]
    ]
    expect(markTile(board, {x: 1, y: 1})).toEqual(newBoard)
  })

  it('marks a tile without a mine under it', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MARKED, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false},
      ]
    ]
    const newBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true},
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false},
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false},
      ]
    ]
    expect(markTile(board, {x: 0, y: 0})).toEqual(newBoard)
  })

  it('marks a tile without a mine and displays the number', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MINE, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ]
    ]
    expect(markTile(board, {x: 0, y: 0})).toEqual(board)
  })

  it('marks a tile with a mine and does nothing', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.MINE, mine: true },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ]
    ]
    expect(markTile(board, {x: 0, y: 0})).toEqual(board)
  })
  it('marks a tile already with a number and does nothing', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ]
    ]
    expect(markTile(board, {x: 0, y: 0})).toEqual(board)
  })
})

describe('#revealTile', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ]
    ]  
    it('reveals a mine when clicked and sets the status to MINE', () => {
      const newBoard = [
        [
          { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
          { x: 0, y: 1, status: TILE_STATUSES.MINE, mine: true },
        ],
        [
          { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
          { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
        ]
      ]      
      expect(revealTile(board, {x: 0, y: 1})).toEqual(newBoard)
    })      
})

describe('#revealTile', () => {
  const board = [
    [
      { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
      { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
    ],
    [
      { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
      { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
    ]
  ]  
  it('provides mine count when tile is selected next to a mine', () => {
    const newBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ],
    ]
    expect(revealTile(board, { x: 0, y: 0 })).toEqual(newBoard)
  })   
})

describe('a larger board', () => {
  const board = [
    [
      { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: true },
      { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      { x: 0, y: 2, status: TILE_STATUSES.HIDDEN, mine: false },
    ],
    [
      { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
      { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      { x: 1, y: 2, status: TILE_STATUSES.HIDDEN, mine: false },
    ],
    [
      { x: 2, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
      { x: 2, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      { x: 2, y: 2, status: TILE_STATUSES.HIDDEN, mine: false },
    ]
  ] 
  it('reveals nearby tiles when not adjacent to a mine', () => {
    const newBoard = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: true },
        { x: 0, y: 1, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
        { x: 0, y: 2, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
        { x: 1, y: 1, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 1 },
        { x: 1, y: 2, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
      ],
      [
        { x: 2, y: 0, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
        { x: 2, y: 1, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
        { x: 2, y: 2, status: TILE_STATUSES.NUMBER, mine: false, adjacentMinesCount: 0 },
      ]
    ] 
    expect(revealTile(board, { x: 2, y: 2 })).toEqual(newBoard)  
  })
  it('does nothing when a numbered tile is clicked', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.HIDDEN, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ]
    ]  
    expect(revealTile(board, { x: 0, y: 0 })).toEqual(board)
  })
})

describe('#checkWin', () => {
  it('wins game when all tiles are numbered or marked', () => {
    const board = [
    [
      { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
      { x: 0, y: 1, status: TILE_STATUSES.MARKED, mine: true },
    ],
    [
      { x: 1, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
      { x: 1, y: 1, status: TILE_STATUSES.NUMBER, mine: false },
    ]
  ]  
  expect(checkWin(board)).toBeTruthy()
})
it('game continues if only some tiles are numbered or marked', () => {
  const board = [
  [
    { x: 0, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
    { x: 0, y: 1, status: TILE_STATUSES.MARKED, mine: true },
  ],
  [
    { x: 1, y: 0, status: TILE_STATUSES.NUMBER, mine: false },
    { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
  ]
]  
expect(checkWin(board)).toBeFalsy()
})
})

describe('#checkLose', () => {
  it('loses game when a mine is clicked', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.MINE, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.NUMBER, mine: false },
      ]
    ]  
    expect(checkLose(board)).toBeTruthy()
  })
  it('game not lost and continues if no mine is clicked', () => {
    const board = [
      [
        { x: 0, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 0, y: 1, status: TILE_STATUSES.MARKED, mine: true },
      ],
      [
        { x: 1, y: 0, status: TILE_STATUSES.HIDDEN, mine: false },
        { x: 1, y: 1, status: TILE_STATUSES.HIDDEN, mine: false },
      ]
    ]  
    expect(checkLose(board)).toBeFalsy()
  })
})

describe('#positionMatch', () => {
  it('returns true when a and b match', () => {
    const aa = { x: 0, y: 0 }
    const bb = { x: 0, y: 0 }
    expect(positionMatch(aa, bb)).toBeTruthy()
  })
  it('returns true when a and b match', () => {
    const aa = { x: 0, y: 0 }
    const bb = { x: 1, y: 1 }
    expect(positionMatch(aa, bb)).toBeFalsy()
  })
})


