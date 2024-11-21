Feature: Input Validation

    Scenario: Explore all input validation
        # start
        Given the user navigates to "eligibility-checker/example-grant/start"
        When the user clicks on "Start now"

        # country
        Then the user should be at URL "country"
        When the user continues
        Then the user should see error "Select an option"

        # reset session state
        And completes the journey
