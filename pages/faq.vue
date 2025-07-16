<script setup>
import { ref } from 'vue'

const faqs = ref([
  {
    question: 'Do you offer worldwide shipping?',
    answer: `Yes! We currently ship to over 249 countries worldwide. 🌍 We always choose the most optimal shipping method based on your location.`
  },
  {
    question: 'How long will my order take to arrive?',
    answer: `Delivery time depends on your location. Most orders are delivered within 7–20 business days. You’ll receive an estimated delivery time with your tracking link once the order is shipped.`
  },
  {
    question: 'Can I track my order?',
    answer: `Absolutely. Once your order is placed, you can track it on our <a href="/track">Track My Order</a> page using your order number and email address.`
  },
  {
    question: 'How are the products selected?',
    answer: `Every piece in our store is handpicked to reflect our unique style and values. We carefully select our suppliers and curate each item to ensure quality and aesthetic harmony.`
  },
  {
    question: 'Can I return or exchange my order?',
    answer: `Returns are accepted in special cases. Please email us at <a href="mailto:solunarashop@gmail.com">solunarashop@gmail.com</a> within 30 days of receiving your order. We'll review the case and provide options for partial refund, resending, or return.`
  },
  {
    question: 'Do I have to pay customs or duties?',
    answer: `In most cases, no. However, for high-value orders, customs fees may apply depending on your country’s regulations. These are the responsibility of the customer.`
  },
  {
    question: 'What if I receive the wrong or damaged item?',
    answer: `We’re really sorry! Please contact us at <a href="mailto:solunarashop@gmail.com">solunarashop@gmail.com</a> with your order number and photos. We'll resolve it as quickly as possible.`
  },
  {
    question: 'Can I cancel or change my order?',
    answer: `We process orders quickly to ensure fast delivery. If you need to make changes, please contact us as soon as possible. Once shipped, changes may not be possible.`
  },
  {
    question: 'Do you restock sold-out items?',
    answer: `Sometimes! Feel free to contact us about any specific item, and we’ll let you know if and when it will be restocked.`
  },
  {
    question: 'Where can I contact you?',
    answer: `Email us anytime at <a href="mailto:solunarashop@gmail.com">solunarashop@gmail.com</a> — we’re here to help!`
  }
])

</script>

<template>
  <div class="faq-page">
    <h1>Frequently Asked Questions</h1>
    <div class="faq-list">
      <details v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <summary>{{ faq.question }}</summary>
        <p v-html="faq.answer"></p>
      </details>
    </div>
  </div>
</template>

<style scoped>
.faq-page {
  padding: 2rem;
  max-width: 800px;
  margin: auto;
  font-family: 'Lato', sans-serif;
  color: #2f2f2f;
}

h1 {
  text-align: center;
  font-family: 'Playfair Display', serif;
  margin-bottom: 2rem;
  font-size: 32px;
  color: #2f2f2f;
  font-weight: 600;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.faq-item {
  background-color: #f7f5f2;
  border-radius: 20px;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.faq-item[open] summary {
  background-color: #eeeae3;
}

.faq-item summary {
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: "▼";
  font-size: 1rem;
  margin-left: 10px;
  transition: transform 0.3s ease;
  color: #B6867A;
}

.faq-item[open] summary::after {
  transform: rotate(180deg);
}

.faq-item p {
  padding: 0 1.5rem 1rem;
  margin-top: 0.5rem;
  line-height: 1.6;
  color: #5a5a5a;
}

@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }

  .faq-item summary {
    font-size: 1rem;
    padding: 1rem 1.25rem;
  }
}

</style>
