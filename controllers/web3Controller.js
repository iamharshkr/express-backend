const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { Web3 } = require("web3");

const provider = process.env.INFURA_URL;
const web3Provider = new Web3.providers.HttpProvider(provider);
const web3 = new Web3(web3Provider);

// fetch eth balance
/**
 * @swagger
 * /api/v1/balance/{address}:
 *   get:
 *     summary: Get Ethereum balance for a given address
 *     description: Retrieve the Ethereum balance for the specified address.
 *     tags:
 *       - Web3
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         description: Ethereum address for which to fetch the balance
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the Ethereum balance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 balance:
 *                   type: string
 *                   description: Ethereum balance for the specified address.
 *       '401':
 *         description: Unauthorized. User authentication failed.
 *       '500':
 *         description: Internal Server Error. Failed to retrieve Ethereum balance.
 */
exports.fetchEthBalance = catchAsyncErrors(async (req, res, next) => {
  try {
    const address = req.params.address; // Get the address from the URL
    const balance = await web3.eth.getBalance(address);
    res
      .status(200)
      .json({ success: true, balance: web3.utils.fromWei(balance, "ether") }); // Convert from Wei to Ether
  } catch (error) {
    console.error("Error fetching Ethereum balance:", error);
    return next(new ErrorHandler("Failed to fetch Ethereum balance", 500));
  }
});
