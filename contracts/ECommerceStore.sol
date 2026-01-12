// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IAgentWallet {
    function executeAction(
        address target,
        uint256 value,
        bytes memory data
    ) external returns (bytes memory);

    function getBalance() external view returns (uint256);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title ECommerceStore
 * @notice Mock e-commerce platform that accepts payments from AgentWallet
 * @dev Products have title, description, and price. Payments debit ETH and tokens from AgentWallet
 */
contract ECommerceStore {
    struct Product {
        uint256 id;
        string title;
        string description;
        uint256 priceInWei; // Price in ETH/native currency
        uint256 priceInTokens; // Price in ERC20 tokens
        address seller;
        bool isActive;
        uint256 stock;
    }

    struct Order {
        uint256 orderId;
        uint256 productId;
        address buyer;
        address agentWallet;
        uint256 paidInWei;
        uint256 paidInTokens;
        uint256 timestamp;
        bool fulfilled;
    }

    // State variables
    uint256 public productCounter;
    uint256 public orderCounter;
    address public platformOwner;
    address public paymentToken; // ERC20 token address for token payments
    uint256 public platformFeePercent; // Fee in basis points (e.g., 250 = 2.5%)

    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;

    // Events
    event ProductListed(
        uint256 indexed productId,
        string title,
        uint256 priceInWei,
        uint256 priceInTokens,
        address indexed seller
    );

    event ProductUpdated(
        uint256 indexed productId,
        uint256 newPriceInWei,
        uint256 newPriceInTokens
    );
    event ProductDeactivated(uint256 indexed productId);

    event OrderPlaced(
        uint256 indexed orderId,
        uint256 indexed productId,
        address indexed buyer,
        address agentWallet,
        uint256 paidInWei,
        uint256 paidInTokens
    );

    event OrderFulfilled(uint256 indexed orderId);
    event PaymentReceived(address indexed from, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == platformOwner, "Not platform owner");
        _;
    }

    constructor(address _paymentToken, uint256 _platformFeePercent) {
        platformOwner = msg.sender;
        paymentToken = _paymentToken;
        platformFeePercent = _platformFeePercent;
        productCounter = 0;
        orderCounter = 0;
    }

    /**
     * @notice List a new product on the platform
     * @param _title Product title
     * @param _description Product description
     * @param _priceInWei Price in Wei (ETH)
     * @param _priceInTokens Price in tokens
     * @param _stock Initial stock quantity
     */
    function listProduct(
        string memory _title,
        string memory _description,
        uint256 _priceInWei,
        uint256 _priceInTokens,
        uint256 _stock
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(
            _priceInWei > 0 || _priceInTokens > 0,
            "Price must be greater than 0"
        );

        productCounter++;

        products[productCounter] = Product({
            id: productCounter,
            title: _title,
            description: _description,
            priceInWei: _priceInWei,
            priceInTokens: _priceInTokens,
            seller: msg.sender,
            isActive: true,
            stock: _stock
        });

        emit ProductListed(
            productCounter,
            _title,
            _priceInWei,
            _priceInTokens,
            msg.sender
        );

        return productCounter;
    }

    /**
     * @notice Update product pricing
     * @param _productId Product ID to update
     * @param _newPriceInWei New price in Wei
     * @param _newPriceInTokens New price in tokens
     */
    function updateProductPrice(
        uint256 _productId,
        uint256 _newPriceInWei,
        uint256 _newPriceInTokens
    ) external {
        Product storage product = products[_productId];
        require(product.seller == msg.sender, "Not the seller");
        require(product.isActive, "Product not active");

        product.priceInWei = _newPriceInWei;
        product.priceInTokens = _newPriceInTokens;

        emit ProductUpdated(_productId, _newPriceInWei, _newPriceInTokens);
    }

    /**
     * @notice Deactivate a product
     * @param _productId Product ID to deactivate
     */
    function deactivateProduct(uint256 _productId) external {
        Product storage product = products[_productId];
        require(
            product.seller == msg.sender || msg.sender == platformOwner,
            "Not authorized"
        );

        product.isActive = false;

        emit ProductDeactivated(_productId);
    }

    /**
     * @notice Purchase a product using AgentWallet
     * @dev This function is called by the AgentWallet to make a purchase
     * @param _productId Product ID to purchase
     * @param _agentWallet Address of the AgentWallet making the payment
     */
    function purchaseWithAgentWallet(
        uint256 _productId,
        address _agentWallet
    ) external payable returns (uint256) {
        Product storage product = products[_productId];

        require(product.isActive, "Product not active");
        require(product.stock > 0, "Out of stock");
        require(_agentWallet != address(0), "Invalid wallet address");

        // Verify payment amounts
        uint256 totalWeiRequired = product.priceInWei;
        uint256 totalTokensRequired = product.priceInTokens;

        // Handle ETH payment
        if (totalWeiRequired > 0) {
            require(msg.value >= totalWeiRequired, "Insufficient ETH sent");
        }

        // Handle token payment (if required)
        if (totalTokensRequired > 0 && paymentToken != address(0)) {
            // Transfer tokens from AgentWallet to this contract
            IERC20 token = IERC20(paymentToken);
            require(
                token.transferFrom(
                    _agentWallet,
                    address(this),
                    totalTokensRequired
                ),
                "Token transfer failed"
            );
        }

        // Create order
        orderCounter++;

        orders[orderCounter] = Order({
            orderId: orderCounter,
            productId: _productId,
            buyer: msg.sender,
            agentWallet: _agentWallet,
            paidInWei: msg.value,
            paidInTokens: totalTokensRequired,
            timestamp: block.timestamp,
            fulfilled: false
        });

        userOrders[msg.sender].push(orderCounter);

        // Update stock
        product.stock--;

        // Calculate and distribute payments
        _processPayment(product.seller, msg.value, totalTokensRequired);

        emit OrderPlaced(
            orderCounter,
            _productId,
            msg.sender,
            _agentWallet,
            msg.value,
            totalTokensRequired
        );

        return orderCounter;
    }

    /**
     * @notice Request payment from AgentWallet for a product
     * @dev Initiates a purchase by calling executeAction on the AgentWallet
     * @param _productId Product ID to purchase
     * @param _agentWallet Address of the AgentWallet to charge
     */
    function requestPaymentFromWallet(
        uint256 _productId,
        address _agentWallet
    ) external returns (uint256) {
        Product memory product = products[_productId];

        require(product.isActive, "Product not active");
        require(product.stock > 0, "Out of stock");
        require(_agentWallet != address(0), "Invalid wallet address");

        // Prepare the call data for purchaseWithAgentWallet
        bytes memory callData = abi.encodeWithSignature(
            "purchaseWithAgentWallet(uint256,address)",
            _productId,
            _agentWallet
        );

        // Execute the purchase through AgentWallet
        IAgentWallet wallet = IAgentWallet(_agentWallet);
        wallet.executeAction(address(this), product.priceInWei, callData);

        return orderCounter; // Returns the order ID created
    }

    /**
     * @notice Process payment distribution
     * @param _seller Seller address
     * @param _weiAmount Amount in Wei
     * @param _tokenAmount Amount in tokens
     */
    function _processPayment(
        address _seller,
        uint256 _weiAmount,
        uint256 _tokenAmount
    ) internal {
        // Calculate platform fee
        uint256 weiFee = (_weiAmount * platformFeePercent) / 10000;
        uint256 tokenFee = (_tokenAmount * platformFeePercent) / 10000;

        uint256 sellerWei = _weiAmount - weiFee;
        uint256 sellerTokens = _tokenAmount - tokenFee;

        // Transfer ETH to seller
        if (sellerWei > 0) {
            payable(_seller).transfer(sellerWei);
        }

        // Transfer tokens to seller
        if (sellerTokens > 0 && paymentToken != address(0)) {
            IERC20 token = IERC20(paymentToken);
            require(
                token.transfer(_seller, sellerTokens),
                "Token transfer to seller failed"
            );
        }

        emit PaymentReceived(_seller, sellerWei);
    }

    /**
     * @notice Mark an order as fulfilled
     * @param _orderId Order ID to fulfill
     */
    function fulfillOrder(uint256 _orderId) external {
        Order storage order = orders[_orderId];
        Product memory product = products[order.productId];

        require(product.seller == msg.sender, "Not the seller");
        require(!order.fulfilled, "Already fulfilled");

        order.fulfilled = true;

        emit OrderFulfilled(_orderId);
    }

    /**
     * @notice Get product details
     * @param _productId Product ID
     */
    function getProduct(
        uint256 _productId
    )
        external
        view
        returns (
            uint256 id,
            string memory title,
            string memory description,
            uint256 priceInWei,
            uint256 priceInTokens,
            address seller,
            bool isActive,
            uint256 stock
        )
    {
        Product memory product = products[_productId];
        return (
            product.id,
            product.title,
            product.description,
            product.priceInWei,
            product.priceInTokens,
            product.seller,
            product.isActive,
            product.stock
        );
    }

    /**
     * @notice Get order details
     * @param _orderId Order ID
     */
    function getOrder(
        uint256 _orderId
    )
        external
        view
        returns (
            uint256 orderId,
            uint256 productId,
            address buyer,
            address agentWallet,
            uint256 paidInWei,
            uint256 paidInTokens,
            uint256 timestamp,
            bool fulfilled
        )
    {
        Order memory order = orders[_orderId];
        return (
            order.orderId,
            order.productId,
            order.buyer,
            order.agentWallet,
            order.paidInWei,
            order.paidInTokens,
            order.timestamp,
            order.fulfilled
        );
    }

    /**
     * @notice Get all orders for a user
     * @param _user User address
     */
    function getUserOrders(
        address _user
    ) external view returns (uint256[] memory) {
        return userOrders[_user];
    }

    /**
     * @notice Update payment token address
     * @param _newToken New token address
     */
    function updatePaymentToken(address _newToken) external onlyOwner {
        paymentToken = _newToken;
    }

    /**
     * @notice Update platform fee
     * @param _newFeePercent New fee in basis points
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = _newFeePercent;
    }

    /**
     * @notice Withdraw platform fees
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(platformOwner).transfer(balance);
    }

    /**
     * @notice Withdraw platform token fees
     */
    function withdrawPlatformTokenFees() external onlyOwner {
        require(paymentToken != address(0), "No payment token set");
        IERC20 token = IERC20(paymentToken);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No token balance");
        require(
            token.transfer(platformOwner, balance),
            "Token transfer failed"
        );
    }

    // Receive function to accept ETH
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }
}
