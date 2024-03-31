const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");

// Fetch all data from the API
/**
 * @swagger
 * /api/v1/get-all:
 *   get:
 *     summary: Fetch all data from the API
 *     description: Retrieves data from a public API, optionally applying pagination and category filtering.
 *     tags:
 *       - Data
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The maximum number of items per page (default is 10).
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category to filter the data by.
 *     responses:
 *       '200':
 *         description: Successful operation. Returns paginated and filtered data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 count:
 *                   type: integer
 *                   description: The number of items returned in the current page.
 *                 total:
 *                   type: integer
 *                   description: The total number of items matching the filter criteria.
 *                 page:
 *                   type: integer
 *                   description: The current page number.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages based on the filter criteria.
 *                 data:
 *                   type: array
 *                   description: The paginated and filtered data.
 *                   items:
 *                     type: object
 *       '400':
 *         description: Bad Request. The provided page number or limit is invalid.
 *       '404':
 *         description: Not Found. No data found for the specified category.
 *       '500':
 *         description: Internal Server Error. Failed to fetch data from the API.
 */

exports.fetchAllData = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch data from the API
    const data = await fetch("https://api.publicapis.org/entries");
    const apiData = await data.json();

    // Apply pagination and category filtering
    let { page = 1, limit = 10, category } = req.query;

    // Convert page and limit to positive integers
    page = Math.max(1, parseInt(page, 10));
    limit = Math.max(1, parseInt(limit, 10));

    // Check for negative values for page and limit
    if (page <= 0 || limit <= 0) {
      return next(
        new ErrorHandler("Page number and limit must be positive integers", 400)
      );
    }
    const startIndex = (page - 1) * limit;
    let filteredData = apiData.entries;

    // Filter by category if provided
    if (category) {
      const lowerCaseCategory = category.toLowerCase();
      filteredData = filteredData.filter(
        (entry) => entry.Category.toLowerCase() === lowerCaseCategory
      );
      // Check if the category has matching data
      if (filteredData.length === 0) {
        return next(new ErrorHandler("No data found for the specified category", 404));
      }
    }

    // Check if the requested page number exceeds the total number of pages
    const totalPages = Math.ceil(filteredData.length / limit);
    if (page > totalPages) {
      return next(new ErrorHandler("Page number exceeds total number of pages", 400));
    }

    // Paginate the results
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    // Return the paginated and filtered data
    res.status(200).json({
      success: true,
      count: paginatedData.length,
      total: filteredData.length,
      page: page,
      totalPages: totalPages,
      data: paginatedData,
    });
  } catch (error) {
    console.error("Error fetching API data:", error);
    return next(new ErrorHandler("Failed to fetch data from the API", 500));
  }
});
