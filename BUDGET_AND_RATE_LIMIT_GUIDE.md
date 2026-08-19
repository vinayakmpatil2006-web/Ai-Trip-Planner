# Rate Limit & Budget Reset Guide

## 📱 Budget Input - How It Works

✅ **NEW:** Users now enter ANY custom budget amount
- No more "Budget", "Moderate", "Luxury" levels
- Users type: ₹10000, ₹50000, ₹200000, ₹500000, etc.
- Minimum budget: ₹10,000
- No maximum limit
- AI generates itinerary based on EXACT amount user enters

### Example:
- User enters: **₹75,000**
- Total trip duration: **5 days**
- Daily budget: 75,000 ÷ 5 = ₹15,000/day
- AI allocates: ~40% hotels, ~30% activities, ~20% food

---

## ⏰ Rate Limit & Multiple Trips

### **Question: Can user generate another trip 60 seconds later?**

**YES! ✅**

**Here's how it works:**

### Free Tier Rate Limits:
- **60 requests per minute** allowed
- After 60 seconds (1 minute), your quota resets
- You can generate another trip

### Timeline:
```
🕐 Time 0:00 - User generates Trip 1 ✅
   (Uses 1 of 60 requests)
   
🕐 Time 0:05 - User tries to generate Trip 2
   ✅ Still works! (2 of 60 requests)
   
🕐 Time 0:15 - User tries to generate Trip 3
   ✅ Still works! (3 of 60 requests)
   
🕐 Time 0:50 - User generates 60th request
   ✅ Works! (60 of 60 requests)
   
🕐 Time 0:51 - User tries to generate Trip 61
   ❌ BLOCKED! Rate limit exceeded
   
🕐 Time 1:05 - Rate limit resets
   ✅ NOW they can generate again!
```

---

## 📊 Rate Limit Details

| Limit | Value | Time Window |
|-------|-------|-------------|
| Max Requests | 60 | 1 minute (60 seconds) |
| Daily Quota | 1,500 | 24 hours |
| Cool-off Period | Automatic | After hitting 60/min limit |

---

## ✅ What This Means For Users

### **Best Practice:**
- Generate 1 trip every **5-10 seconds**
- In 1 minute, can generate **6-12 trips** safely
- If hit rate limit, **WAIT 60 SECONDS** to reset
- After 60 seconds, quota automatically refreshes

### **Safe Usage:**
```
✅ Generate Trip 1 → Wait 5s → Generate Trip 2 → Wait 5s → Generate Trip 3
(All within 60 second window with different budgets)

❌ Don't: Click 60 times in 30 seconds (you'll hit limit at request 60)
```

---

## 💡 Rate Limit Error Handling

When user sees error: **"Rate limit exceeded"**
- They hit 60 requests in 1 minute
- Just **wait 60 seconds** and try again
- Counter resets automatically
- No need to restart app or browser

---

## Higher Limits Options

### Option 1: Get Waitlist Approval (Recommended)
- Go to: https://ai.google.dev/waitlist
- Join "Increased Rate Limits" waitlist
- Approval: Usually within 24-48 hours
- New limits: Up to **1,500 requests/minute**
- Cost: FREE

### Option 2: Enable Paid Plan
- Enable billing at https://aistudio.google.com/
- Pay per API call (~₹0.05 per 1M tokens)
- Unlimited rate limits
- Cost: Very cheap

---

## 📋 Summary

| Feature | Status |
|---------|--------|
| Custom Budget Input | ✅ YES (any amount) |
| Min Budget | ₹10,000 |
| Max Budget | None (user sets) |
| Trips per Minute | 60 (free tier) |
| Reset Timer | 60 seconds automatic |
| Multi-trip Support | ✅ YES (after rate reset) |
| Generate at 60 seconds + 1ms | ✅ YES |

---

## 🎯 Conclusion

✨ **Users CAN generate multiple trips, but with rate limits:**
- **First minute:** Up to 60 trips
- **After 60 seconds:** Limit resets, can generate 60 more
- **Workflow:** 1 trip every 5-10 seconds = smooth experience
- **If hit limit:** Just wait 60 seconds!
