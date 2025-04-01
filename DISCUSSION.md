# Reflections on Potential Improvements

If I had more time, I would have focused on several key enhancements to improve the user experience and system performance:

## 1. Frontend Filters
Adding filters on the frontend would have been a priority. The backend API is already capable of filtering based on degree, specialty, experience, and city. However, I was already going a bit over the suggested time, so I decided to leave this out since a good version would have taken at least an additional hour. Ideally, I would have used multi-select components for cities and degrees, a custom multi-select component for specializations (given the extensive list), and a range picker for experience. This would provide users with a more refined search experience.

## 2. Debouncing Strategy for Search Bar
I would have introduced a debouncing strategy on the search bar. This would allow users to see results dynamically without needing to manually hit search or press enter. Implementing this feature would enhance the responsiveness of the search functionality, making it more user-friendly while still limiting the number of API calls.

## 3. Database Optimization
I did not implement any database optimizations, such as indexing or caching, directly. In a production environment, these would be essential for performance. While this wasn’t a valuable use of time for the scope of this exercise, in a real application it would be an important consideration.

## 4. Search/Filter highlighting
Another improvement I wanted to make was highlighting relevant search terms or filters in the results. For example, if a user filters by a specific specialty or searches for a keyword, that term would be visually highlighted in the matching results. This might work better for text search than for filters, but it’s hard to say for sure without seeing how it feels in practice.

## 5. Additional UI Improvements
There are several UI enhancements that could have been made. These include better indicators for sorted columns and an overall cleaner design. While the current design is functional, it remains basic and could benefit from further refinement to enhance visual appeal and usability.

## 6. Accessibility Standards
Ensuring the application is accessible to users with disabilities and adheres to accessibility standards is always important to keep in mind, but it is especially important here. Since we’re building an advocate directory, there’s a much higher chance that users will actually rely on accessibility features to navigate and use the app. While I didn't spend any time on this, it is a very important implementation detail to keep in mind.

## 7. Testing
I didn't include any tests for the sake of time, but in a production environment unit, api, and integration tests would be super important to ensure the reliability of new features and prevent regressions and bugs.


# Additional Notes

## Dual Search Methodology
The idea behind having both a search bar and filter components was to support different user preferences. Users who aren’t sure what they’re looking for could browse the filter menu for inspiration, while users with something specific in mind (like “chronic pain”) could search directly. This dual approach leverages the strengths of both methods to enhance the overall user experience.

## Specialty Preview
I chose to display specialties as a comma-separated string (up to 75 characters), with any extras represented by a `+n more` suffix. The main reason for this decision was to keep the table clean and easy to scan. Listing all specialties would create a dense block of text that overwhelms the layout and makes it harder for users to quickly interpret the data. By showing a concise preview and letting users expand for more, the table stays visually balanced while still giving access to the full information. Paired with search and filtering, this approach supports both clarity and usability.

## Updating the specialties column type
I switched from a `jsonb` column to a `text[]` array for storing specialties to improve query performance and compatibility with Drizzle. Postgres `text[]` supports native operators like `&&` (array overlap), which Drizzle maps to clean, type-safe queries using `arrayOverlaps(...)`. With jsonb, filtering required more complex SQL and couldn’t use these array-specific optimizations. This simplified the code and enabled faster, more efficient queries.