const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const productElement = btn.closest("article");
  fetch(`/admin/product/${productId}`, { method: "DELETE" })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => {
        console.log(err);
    });
};
