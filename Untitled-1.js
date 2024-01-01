const tf = require('@tensorflow/tfjs-node');
const sql = require('mssql');

// Kết nối đến SQL Server
async function connectToSQLServer() {
    try {
        await sql.connect({
            server: 'your-server',
            user: 'your-username',
            password: 'your-password',
            database: 'your-database',
        });
        console.log('Connected to SQL Server');
    } catch (error) {
        console.error('Error connecting to SQL Server:', error.message);
    }
}

// Lấy dữ liệu từ SQL Server
async function getDataFromSQLServer() {
    try {
        const result = await sql.query`SELECT UserId, ProductId, Rating FROM TrackingUser`;
        return result.recordset;
    } catch (error) {
        console.error('Error querying data from SQL Server:', error.message);
        return [];
    }
}

// Xử lý dữ liệu và xây dựng mô hình recommendation
function buildRecommendationModel(data) {
    // Chia dữ liệu thành tập huấn luyện và kiểm thử
    const shuffledData = tf.util.shuffle(data);
    const numTrainExamples = Math.floor(shuffledData.length * 0.8);
    const trainData = shuffledData.slice(0, numTrainExamples);
    const testData = shuffledData.slice(numTrainExamples);

    // Chuyển đổi dữ liệu thành dạng tensor
    const userIds = trainData.map((d) => d.UserId);
    const productIds = trainData.map((d) => d.ProductId);
    const ratings = trainData.map((d) => d.Rating);
    const numUsers = [...new Set(userIds)].length;
    const numProducts = [...new Set(productIds)].length;

    const userTensor = tf.tensor(userIds, [userIds.length, 1], 'int32');
    const productTensor = tf.tensor(productIds, [productIds.length, 1], 'int32');
    const ratingTensor = tf.tensor(ratings, [ratings.length, 1], 'float32');

    // Xây dựng mô hình
    const model = tf.sequential();
    model.add(tf.layers.embedding({ inputDim: numUsers, outputDim: 5, inputLength: 1 }));
    model.add(tf.layers.embedding({ inputDim: numProducts, outputDim: 5, inputLength: 1 }));
    model.add(tf.layers.concatenate());
    model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // Huấn luyện mô hình
    model.fit([userTensor, productTensor], ratingTensor, { epochs: 10 });

    return model;
}

// Đưa ra gợi ý dựa trên mô hình đã xây dựng
function recommend(model, userId) {
    // Lấy danh sách sản phẩm chưa được người dùng đánh giá
    const unratedProducts = [...new Set(data.map((d) => d.ProductId))].filter(
        (productId) => !data.some((d) => d.UserId === userId && d.ProductId === productId)
    );

    // Tạo dữ liệu đầu vào cho việc đưa ra dự đoán
    const inputTensors = {
        userId: tf.tensor(unratedProducts.map(() => userId), [unratedProducts.length, 1], 'int32'),
        productId: tf.tensor(unratedProducts, [unratedProducts.length, 1], 'int32'),
    };

    // Đưa ra dự đoán
    const predictions = model.predict([inputTensors.userId, inputTensors.productId]);

    // Lấy giá trị dự đoán và sản phẩm tương ứng
    const predictedRatings = predictions.dataSync();
    const recommendations = unratedProducts.map((productId, index) => ({
        productId,
        predictedRating: predictedRatings[index],
    }));

    // Sắp xếp theo điểm dự đoán giảm dần
    recommendations.sort((a, b) => b.predictedRating - a.predictedRating);

    return recommendations;
}

// Main function
async function main() {
    await connectToSQLServer();

    // Lấy dữ liệu từ SQL Server
    const data = await getDataFromSQLServer();

    // Xử lý dữ liệu và xây dựng mô hình recommendation
    const model = buildRecommendationModel(data);

    // Sử dụng mô hình để đưa ra gợi ý
    const userId = 'userId'; // Thay đổi userId theo người dùng cụ thể
    const recommendations = recommend(model, userId);

    console.log('Recommendations:', recommendations);
}

main();
