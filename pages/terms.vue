<template>
  <div class="terms-page">
    <h1>TERMS OF PURCHASE</h1>
    <p>By placing an order, you agree to the following terms:</p>
    <ul>
      <li>All orders are final once placed. We do not offer returns or exchanges unless the item is defective.</li>
      <li>Delivery is provided by third-party logistics partners. Delivery times may vary and are not guaranteed.</li>
      <li>You may be required to pay customs duties or import taxes in your country.</li>
      <li>We are not responsible for delays caused by customs, shipping providers, or force majeure events.</li>
      <li>By checking out, you confirm your shipping details are correct. We are not responsible for incorrect address entries.</li>
    </ul>
    <p>For any questions, contact us at <a href="mailto:solunarashop@gmail.com">solunarashop@gmail.com</a>.</p>
    <button @click="$router.back()">GO BACK</button>
  </div>
</template>

<style scoped>
.terms-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Lato', sans-serif;
  background-color: #faf9f6;
  color: #2f2f2f;
}
h1 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  margin-bottom: 1.5rem;
}
ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin-top: 1rem;
}
li {
  margin-bottom: 1rem;
  font-size: 18px;
}
a {
  color: #b6867a;
  text-decoration: underline;
}
button {
  margin-top: 2rem;
  background-color: #dcc8b4;
  color: #2f2f2f;
  padding: 10px 20px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-weight: 500;
  font-size: 28px;
}
button:hover {
  background-color: #cfa38c;
  color: #fff;
  font-weight: 600;
}

@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }

  button {
    font-size: 18px;
  }
}
</style>
