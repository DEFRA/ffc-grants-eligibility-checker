import { createMachine, interpret } from 'xstate';
import { actionImplementations } from './action-implementations.js';
import { QUESTION_META } from './metadata-patterns.js';
import { createTransitions } from './transition-patterns.js';

export const exampleGrantMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RgB4EMC2AHANmA4gE5oB2ALgLJoDGAFgJYlgB0sZahZAxAHICiADQAqAbQAMAXUSgsAe1j0y9WSWkgUiABwB2AGzMAnLrGbNYgKwBGTec0AmADQgAnogDMBgCzM7lu3bdfO3NPCwMAX3CnVExcAmJyKjpGFmpZAFdyQmcuACEAQQBhAGlxKSQQOQUlFTUNBB1tZk9LMTEDAztdS08WgydXBCt9VstzczFtc38DKcjo9Gw8IlJKGgYmZjTMsmzeQVFJNSrFZVUK+p19IxMzKxt7Aa1LZkC7A0s3TwMbHrdLebgRZxFaJdYpVhgNIkCAAWgAjuk4DUSHkiqUjhUTii6ogAt4fpY9IE3MYiV4nghgi9Jp5NLpxm56dpTICYkt4qskhsWLAoSo4YjkWd9sIysd5Kdahc8V9DJoiboSWTtBSXIhQnYfAYme8xG43NpDQZzGzgcsEmtkpsAGaMNA4LgoNhoMgsNA2t2EAAUrTaAEouOyQZbuRC7SQHeKsZKcTKELpdFrxj9hobpuY3JTPB5mPYlaq7HSvETIlEQCRZBA4GpgxaueCmBLqmdcQhYbpKR3mG1e33+9ozbF62Drbz2Jxm1LzqB6iy3K8xhYDUnjNptNmmc0dbpZknfFchxzQVaeVsMllBjJY63460Ps1zCaGaEjLoFZS7KrF0qOiEQu0R4hg2Y6QtCgpImwt7Xi20qzhqjjqggfjmHmJpEtovReEmYieEBI6nuG9o4FOcbwQgOYGM0Zg5nY9KaP8VjZmMPYsqmtyeNoYhKmW4RAA */
  id: 'exampleGrantMachine',
  predictableActionArguments: true,
  initial: 'start',
  context: {
    previousPageId: null, // Tracks previous page
    currentPageId: 'start', // Tracks current page
    userAnswers: {}, // Store answers here
    completedPageIds: [] // Store completed pages here
  },
  states: {
    start: {
      on: {
        NEXT: {
          target: 'country',
          actions: ['trackPageCompletion', 'updateCurrentPageId']
        }
      },
      meta: {
        currentPageId: 'start',
        nextPageId: 'country'
      }
    },

    country: {
      ...createTransitions('start', 'second-question'),
      meta: {
        ...QUESTION_META,
        currentPageId: 'country',
        previousPageId: 'start',
        nextPageId: 'second-question', // NOSONAR:S1192 - need to improve this later
        title: 'Is the planned project in England?',
        hint: {
          text: 'The site where the work will happen'
        },
        sidebar: {
          values: [
            {
              heading: 'Eligibility',
              content: [
                {
                  para: `This grant is only for projects in England.
              
              Scotland, Wales and Northern Ireland have other grants available.`
                }
              ]
            }
          ]
        },
        answers: [
          {
            key: 'country-A1',
            value: 'Yes'
          },
          {
            key: 'country-A2',
            value: 'No'
          }
        ]
      }
    },

    'second-question': {
      ...createTransitions('country', 'final'),
      meta: {
        ...QUESTION_META,
        currentPageId: 'second-question', // NOSONAR:S1192 - need to improve this later
        previousPageId: 'country',
        nextPageId: 'final',
        title: 'Is this a second question?',
        answers: [
          {
            key: 'second-question-A1',
            value: 'Yes'
          },
          {
            key: 'second-question-A2',
            value: 'No'
          }
        ]
      }
    },

    final: {
      entry: 'loadPageAction',
      after: {
        1000: {
          target: 'start', // Automatically transitions to 'start' after 1 second
          actions: ['resetState']
        }
      },
      meta: {
        currentPageId: 'final'
      }
    }
  }
});

export const exampleGrantMachineService = interpret(
  exampleGrantMachine.withConfig({
    actions: actionImplementations
  })
).onTransition((state) => {
  // istanbul ignore next
  if (state.changed) {
    console.debug('UPDATED STATE:', state);
  }
});
