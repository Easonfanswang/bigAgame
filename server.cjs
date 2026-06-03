const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 钉钉配置（放在后端更安全）
const WEBHOOK_BASE = 'https://oapi.dingtalk.com/robot/send?access_token=64f87a315d70254c66118f39f5f9d58dce5cfeb0bbce47e7d28025df5dc7dd24';
const SECRET = 'SEC47414186126450c7fe9aeaa8f60b888b0db8abf5c72a2e41ffc77f2e6e1fcda5';

const crypto = require('crypto');

function generateSignature(timestamp) {
    const stringToSign = timestamp + "\n" + SECRET;
    const sign = crypto.createHmac('sha256', SECRET).update(stringToSign).digest('base64');
    return encodeURIComponent(sign);
}

app.post('/dingtalk', async (req, res) => {
    try {
        const { content } = req.body;
        const timestamp = Date.now();
        const sign = generateSignature(timestamp);
        const url = `${WEBHOOK_BASE}&timestamp=${timestamp}&sign=${sign}`;

        const response = await axios.post(url, {
            msgtype: 'text',
            text: {
                content: content
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`代理服务器已启动: http://localhost:${PORT}`);
    console.log(`请运行 'ngrok http ${PORT}' 并将生成的 HTTPS 地址填入前端配置`);
});
