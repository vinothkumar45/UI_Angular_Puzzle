 ### Code review
    * memory leak issue not handled.Wherever we are using subscription, that needs to be unsubscribed in ngDestroy
    * Reducers are not available for failedAddToReadingList and failedRemoveFromReadingList actions and hence the test cases were failing.
    * Loaders should be add when making book search for better user experience
    * Better to use async pipe to display the data from store selectors instead of using subscribe for every selector, as we need not to explicitly unsubscribe them.


### Issues from automated scan
    * Background and foreground colours do not have a sufficient contrast ratio

### Accessibility Issues - Manually found
    * Images need to have 'alt' attribute doesn't have explicit width and height
    * Javascript text is not being highlighted.
    * Added aria disabled for the want to read button.
    * Reading List close button does not have a label.
    * Modified the label for want to read button (Added book title to the label).
  #### Fixed issues from code review section
    * Added test cases for reading, book search component, list component, book reducer, book effects,   reading list effects
    * Error handling added for the book search Api
  