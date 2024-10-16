Feature: Checker Journey

    Scenario: Apply for a grant on the example journey
        # start
        Given the user navigates to "/eligibility-checker/example-grant/start"
        Then the user should see heading "Check if you can apply for a grant"
