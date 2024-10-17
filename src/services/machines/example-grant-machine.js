import { assign, createMachine, interpret } from "xstate";

const exampleGrantMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCucAuBLA9gO1gDoAHAJxwCswBjDAWgwE9iwBiAQQDkBlAdQFEASgG0ADAF1EoYjlhZs+KSAAeiAIwAOAGyEArBoAsorQHYAzLvNatojQBoQjRNoCchNQbMuzZgyZea2gC+QQ5omLgEJORUtAzMbFx8QsJqkkggMnIKeEqqCJo6+kamFlY29o6IWi4ATHoufrq6Bi2iBrVaIWHosDlEMqgANhikjPEsHDwCIhJKWfKRedV+hC66tWa1tea1oiZqJg5OCDVuorYHhjZahhrdIOF9kQM4w6PjTJNJM6np0rJFooMvktKt1pttrt9odjogzCZdIREX46nV-N4DAYHk9+u4LnQAEZYUgQWBTZKzf6ZQE5ZYFUQuNyHVqWfSiDy1SonDYaQgacy6BHrDZbLqhR69PFqAnE0nkn4pNLzWlLEHqRnMkysxEaDkdbnONSEYy1XQyjy+DlmnFSl740REklkim-WrUhZ09UMpnubXNXX6rlwhCbUSEHxcyy+Fy2Da2iL4Igyx1yl2KkRmD2q4GgfIy30sgPszmGhDCwg2MyHGpYrb+EwJ55JwgANzApAAhngIJ26PghuM5AAvRLTFJzDKetV59QmWrGg4WhEmPVmDS6EMaY2m836q1qG0S3H2wmoLBDCBYPBQOjyMAAWwV46pKuyM5Uc4XyLUy5Mq9EddNyqUMzHDSMN3MAxYw3WomzxAALMA8Dodsux7TtXQnbN31zT8CnnRdfw5Fc1w3EMKyrGtGk8HYXEbY87RbagcAfYghjADBIFYCB8DAQhr1bHAAGt+OoTshiGbgO1bLBqDAMQcKBXJvTUFxtD0AxTGI6sOTUYCTi5eotF0dSvDAtTdC0BF4PtFi2I4riIFYDtyFIEghk7DAADMcFIB9CHEyTpNIWT5MUt9lPpNSBUIBd9EMfRTLFEM1PDPY1LAi4NHo7VxQlPAcAgOAlBPJNIq9WcEDoLQQzoJEmUanwtA8DYSNslsyEoGh6C+MAKo-fIOhDAJjM2QpRFqbx9AYnpEyiQYRjGCZ+qnHMVKq3RJriuptkPFraixENtXqAwND1LTvHWW44MY+bk1lZ14DW3CNvwlwwQjSaAyxFpbhDDokTBPUhQsQ55w0MwOqiNDu17fs8EHOgR1WgFXuijYDErDQ9rqdoLgM9QwLWANGnnay1GsbE7ubKIzwvK8bzvLinwGvD8yFPksQuQJ9BMw6Qy5dLOkPbdOgA0RdGhogkJQ2GMLZt6OaxPR-HNGUDmrf6QI6NxoLBBEzFuDXqbm2miFIMBYicxWMbUzSbAyj6PDULcDgjW5twsGxGnWaXAtY9jOMgW3VNjExCCMWMtr2I3DCOED13DX8TFuMEDixTopZCIIgA */
  id: "exampleGrantMachine",
  initial: "start-page",
  context: {
    currentPage: "start-page", // Tracks current question
    userAnswers: {}, // Store answers here
    completedPages: [], // Store completed pages here
  },
  states: {
    "start-page": {
      on: {
        ANSWER: [
          {
            target: "first-question-page",
            actions: ["updateCurrentPage", "trackPageCompletion"],
          },
        ],
      },
    },
    "first-question-page": {
      type: "final",
    },
  },
  actions: {
    updateCurrentPage: assign({
      /**
       * Updates the current page
       * @param {object} context machine context
       * @param {object} event triggered event
       * @returns {string} event's question
       */
      currentPage: (context, event) => event.question,
    }),
    trackPageCompletion: assign({
      /**
       * Updates the completed pages
       * @param {object} context machine context
       * @param {object} event triggered event
       * @returns {string} event's question
       */
      completedPages: (context, event) => [
        ...context.completedPages,
        context.currentPage,
      ],
    }),
  },
  guards: {},
  services: {},
});

const exampleGrantService = interpret(exampleGrantMachine).onTransition(
  (state) =>
    console.log(
      `Current state: ${state.value} and current context: ${JSON.stringify(state.context)}`,
    ),
);

exampleGrantService.start();
