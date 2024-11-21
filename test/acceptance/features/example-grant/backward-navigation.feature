Feature: Backward Navigation

    Scenario: Explore all backward navigation options
        # start
        Given the user navigates to "eligibility-checker/example-grant/start"
        When the user clicks on "Start now"

        # country
        Then the user should be at URL "country"
        When the user goes back
        Then the user should be at URL "start"
        When the user clicks on "Start now"
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        When the user selects "Yes"
        And continues

        # consent
        Then the user should be at URL "consent"
        When the user goes back
        Then the user should be at URL "country"

        # reset session state
        And completes the journey
