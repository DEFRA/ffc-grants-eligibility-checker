Feature: Example Grant Checker Journey

    Scenario: Apply for an example grant
        # start
        Given the user navigates to "example-grant/start"
        Then the user should see heading "Check if you can apply for a grant"
