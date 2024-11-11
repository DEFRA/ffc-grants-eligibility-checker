Feature: Example Grant Checker Journey

    Scenario: Apply for an example grant
        # start
        Given the user navigates to "eligibility-checker/example-grant/start"
        Then the user should see heading "Generic checker screens"
        And should see button "Start now"

        # country
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
