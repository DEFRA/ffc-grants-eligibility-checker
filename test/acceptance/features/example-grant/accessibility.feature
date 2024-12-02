Feature: WCAG Accessibility Standards Compliance

    Scenario: Analyze accessibility for all pages in the journey including validation
        # start
        Given the user navigates to "eligibility-checker/example-grant/start"
        Then the user should see heading "Generic checker screens"
        And the page is analysed for accessibility
        When the user clicks on "Start now"

        # country
        Then the user should be at URL "country"
        And should see heading "Is the planned project in England?"
        And the page is analysed for accessibility

        # country validation
        When the user continues
        Then the user should see error "Select an option"
        And the page is analysed for accessibility
        When the user selects "Yes"
        And continues

        # consent
        Then the user should be at URL "consent"
        And should see heading "Confirm and send"
        And the page is analysed for accessibility
        When the user confirms and sends

        # confirmation
        Then the user should be at URL "confirmation"
        And should see heading "Details submitted"
        And the page is analysed for accessibility

        And no accessibility violations should be present in the journey
