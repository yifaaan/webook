local key = KEYS[1]
local window = tonumber(ARGV[1])
local threshold = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local window_start = now - window

-- 移除窗口之外的旧请求
redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)
-- 当前窗口的请求数
local count = redis.call('ZCOUNT', key, '-inf', '+inf')
if count >= threshold then
    return 1
else
    -- 添加当前请求
    redis.call('ZADD', key, now, now)
    -- 刷新过期时间
    redis.call('EXPIRE', key, window)
    return 0
end
