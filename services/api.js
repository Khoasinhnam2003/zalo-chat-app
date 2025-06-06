import axios from 'axios';

const API_URL = 'http://192.168.1.8:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Interceptors để ghi log
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url, config.headers.Authorization || 'No Token');
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (phoneNumber, password) =>
  api.post('/auth/login', { phoneNumber, password });

export const register = (phoneNumber, password, name, otp) =>
  api.post('/auth/register', { phoneNumber, password, name, otp });

export const sendOTP = (phoneNumber, purpose = 'register') =>
  api.post('/auth/send-otp', { phoneNumber, purpose });

export const verifyOTP = (phoneNumber, otp) =>
  api.post('/auth/verify-otp', { phoneNumber, otp });

export const resetPassword = (phoneNumber, newPassword, otp) =>
  api.post('/auth/reset-password', { phoneNumber, newPassword, otp });

export const getProfile = (token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
};

export const updateProfile = (data, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.patch('/auth/profile', data, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
};

export const updatePassword = (data, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.patch('/auth/reset-password-login', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Message APIs
export const getMessageSummary = (token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get('/conversations/summary?minimal=false', { headers: { Authorization: `Bearer ${token}` } });
};

export const getContacts = (token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get('/contacts', { headers: { Authorization: `Bearer ${token}` } });
};

export const searchFriends = (phoneNumber, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get(`/searchs/users/by-phone?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Tạm thời vô hiệu hóa markAsRead và ghi log
export const markAsRead = (chatId, token) => {
  console.warn(`[DEPRECATED] markAsRead called with chatId: ${chatId}. This function is deprecated. Use socket event 'markMessageAsSeen' instead.`);
  return Promise.resolve({ status: 'deprecated' }); // Không gọi API nữa
};

export const getMessages = (targetUserId, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get(`/messages/user/${targetUserId}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const sendMessage = (data, token, isFormData = false) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.post('/messages/send', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
    },
  });
};

export const recallMessage = (messageId, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.patch(`/messages/recall/${messageId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteMessage = (messageId, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.delete(`/messages/${messageId}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const forwardMessage = (messageId, targetReceiverId, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.post(
    '/messages/forward',
    { messageId, targetReceiverId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Friend APIs
export const getFriends = (token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get('/friends/list', { headers: { Authorization: `Bearer ${token}` } });
};

export const getReceivedFriendRequests = (token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get('/friends/received', { headers: { Authorization: `Bearer ${token}` } });
};

export const getSentFriendRequests = (token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get('/friends/sent', { headers: { Authorization: `Bearer ${token}` } });
};

export const sendFriendRequest = (targetUserId, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.post(
    '/friends/send',
    { receiverId: targetUserId, message: 'Xin chào, mình muốn kết bạn với bạn!' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const acceptFriendRequest = (requestId, token) => {
  return api.post(
    '/friends/accept',
    { requestId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const cancelFriendRequest = (requestId, token) => {
  return api.post(
    '/friends/cancel',
    { requestId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeFriend = (friendId, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.post(
    '/friends/remove',
    { friendId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getUserStatus = (targetUserId, token) => {
  if (!token) throw new Error('Không tìm thấy token xác thực.');
  return api.get(`/friends/status/${targetUserId}`, { headers: { Authorization: `Bearer ${token}` } });
};



export default api;