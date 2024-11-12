Feature: Example Grant Checker Journey

    Scenario: Apply for an example grant
        # start
        Given the user navigates to "eligibility-checker/example-grant/start"
        Then the user should see heading "Generic checker screens"
        When the user clicks on "Start now"

        # country
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        When the user selects "Yes"
        And continues

        # second-question
        Then the user should be at URL "second-question"
        And should see heading "Is this a second question?"
        When the user selects "Yes"
        And continues

        # final
        Then the user should be at URL "final"
        And should see heading "Final page"
