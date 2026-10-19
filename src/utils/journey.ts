export interface JourneyQuest {
  id: string;
  name: string;
  exp: number;
  status: 0 | 1 | 2;
}
export interface Journey {
  level: number;
  exp: number;
  totalExp: number;
  quests: JourneyQuest[];
  levelUpPending: boolean;
}
export const createJourney = (): Journey => ({
  level: 1,
  exp: 1,
  totalExp: 3,
  levelUpPending: false,
  quests: [
    { id: '1', name: 'Mở Account', exp: 1, status: 2 },
    { id: '2', name: 'Nộp tiền', exp: 1, status: 0 },
    { id: '3', name: 'Giao dịch', exp: 1, status: 0 },
  ],
});

export function updateJourney(
  state: Journey,
  id: string,
  action: 'perform' | 'claim',
): Journey {
  const index = state.quests.findIndex((quest) => quest.id === id);
  const quest = state.quests[index];
  if (!quest || state.levelUpPending) return state;
  if (
    action === 'perform' &&
    (quest.status !== 0 || index === 0 || state.quests[index - 1].status === 0)
  )
    return state;
  if (action === 'claim' && quest.status !== 1) return state;
  const exp = state.exp + (action === 'claim' ? quest.exp : 0);
  return {
    ...state,
    exp,
    levelUpPending: action === 'claim' && exp === state.totalExp,
    quests: state.quests.map((item) =>
      item.id === id ? { ...item, status: action === 'claim' ? 2 : 1 } : item,
    ),
  };
}

export function finishJourneyLevelUp(state: Journey): Journey {
  if (!state.levelUpPending) return state;
  return {
    ...state,
    level: state.level + 1,
    exp: 0,
    totalExp: state.totalExp + 2,
    levelUpPending: false,
  };
}
