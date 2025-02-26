import Product from "./Product";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { Storage } from "@google-cloud/storage";

type Customer = {
  CustomerID: number;
  CustomerName: string;
};

function ProductGrid({
  products,
}: {
  products: Array<{
    productId: number;
    productName: string;
    productCode: number;
    productWeight: number;
    productCustomerID: number;
    productExpiryDate: string;
    productUrl: string;
  }>;
}) {
  let productUrl2 = ""; // Initialize as an empty string
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [searchString, setSearchString] = useState("");
  const [currentProducts, setCurrentProducts] = useState(products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const [editProduct, setEditProduct] = useState({
    productId: "",
    productName: "",
    productCode: "",
    productWeight: "",
    productCustomerID: "",
    productExpiryDate: "",
    productUrl: "",
  });

  const [addProduct, setAddProduct] = useState({
    productName: "",
    productCode: "",
    productWeight: "",
    productCustomerID: "",
    productExpiryDate: "",
    productUrl: "",
  });

  useEffect(() => {
    if (searchString !== "") {
      setCurrentPage(1);
    }
  }, [searchString]);

  const paginate = (totalPages: any) => setCurrentPage(totalPages);

  const handleAddProduct = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleEditDisplay = (product: any) => {
    setIsFormVisible(!isFormVisible);
    setIsEditingUser(!isEditingUser);
    setSelectedProduct(product);
    setEditProduct({
      productId: product.productId,
      productName: product.productName,
      productCode: product.productCode,
      productWeight: product.productWeight,
      productCustomerID: product.productCustomerID,
      productExpiryDate: product.productExpiryDate,
      productUrl: product.productUrl,
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = currentProducts.filter((product) =>
      product.productName.toLowerCase().includes(searchString.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [currentProducts, searchString]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  //editing a product
  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Make sure productId is defined
    if (!editProduct.productId) {
      console.error("Product ID is required for editing.");
      return;
    }

    try {
      const formData = new FormData(event.currentTarget);

      const productId = formData.get("productId") as string;
      const productCode = formData.get("productCode") as string;
      const productName = formData.get("productName") as string;
      const productWeight = formData.get("productWeight") as string;
      const productCustomerID = formData.get("productCustomerID") as string;
      const productExpiryDate = formData.get("productExpiryDate") as string;
      const productUrl = formData.get("productUrl") as string;

      console.log("Product ID:", productId);
      console.log("Product Code:", productCode);
      console.log("Product Name:", productName);
      console.log("Product Weight:", productWeight);
      console.log("Product Customer ID:", productCustomerID);
      console.log("Product Expiry Date:", productExpiryDate);

      const response = await axios.put(
        `http://localhost:4000/api/products/${productId}`,
        {
          productId,
          productCode,
          productName,
          productWeight,
          productCustomerID,
          productExpiryDate,
          productUrl,
        }
      );

      const data = response.data;

      if (response.status === 200) {
        console.log("Product updated successfully:", data);
        setIsFormVisible(false);
        window.location.reload();
      } else {
        console.error("Error updating product:", data.error);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  //adding a product
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);

      const productId = formData.get("productId") as string;
      const productCode = formData.get("productCode") as string;
      const productName = formData.get("productName") as string;
      const productWeight = formData.get("productWeight") as string;
      const productCustomerID = formData.get("productCustomerID") as string;
      const productExpiryDate = formData.get("productExpiryDate") as string;
      const productUrl = formData.get("productUrl") as File;

      // Log the form data
      // console.log('Product ID:', productId);
      // console.log('Product Code:', productCode);
      // console.log('Product Name:', productName);
      // console.log('Product Weight:', productWeight);
      // console.log('Product Customer ID:', productCustomerID);
      // console.log('Product Expiry Date:', productExpiryDate);
      //console.log('Product Url:', productUrl);

      // Extract filename from productUrl
      //const productImageFile = formData.get('productUrl') as File | null;
      // let productUrl2 = ''; // Initialize as an empty string

      // if (productImageFile) {

      //   console.log(productImageFile);

      //   productUrl2 = ('https://storage.googleapis.com/labeltech/'+productImageFile.name).toString(); // Store the filename

      //   axios.post('http://localhost:4000/upload-image', productImageFile) // Adjust to your endpoint
      // .then(response => {
      //     // Handle successful image upload (use response.data.imageUrl)
      // })
      // .catch(error => {
      //     // Handle upload failure
      // });
      // }

      // You can now send this data to the server to add it to the database
      const response = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productCode,
          productName,
          productWeight,
          productCustomerID,
          productExpiryDate,
          productUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Product added successfully, you can handle this as needed
        console.log("Product added successfully:", data);
        setIsFormVisible(false); // Hide the form after successful submission
        // rerender the page
        window.location.reload();
      } else {
        // Error adding product, handle accordingly
        console.error("Error adding product:", data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  // catch (error) {
  //   //   console.error('Error submitting form:', error);
  //    }}
  const sortProductsByCustomer = (customerId: string) => {
    if (!customerId) {
      setFilteredProducts(products);
      setCurrentProducts(products);
      return;
    }

    const sortedProducts = products.filter(
      (product) => product.productCustomerID.toString() === customerId
    );
    setFilteredProducts(sortedProducts);
    setCurrentProducts(sortedProducts);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex items-center h-20">
        <div className="relative h-10 w-2/3 min-w-[200px]">
          <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-blue-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              ></path>
            </svg>
          </div>
          <input
            className="peer h-full w-full rounded-[7px] border border-black bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            type="text"
            placeholder="  "
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Search
          </label>
        </div>
        <div className="h-10 pl-10">
          <select
            className="rounded-lg border border-black bg-transparent text-gray-800 text-sm h-10 px-2"
            onChange={(e) => sortProductsByCustomer(e.target.value)}
          >
            <option value="">Choose a Customer</option>
            {customers.map((customer) => (
              <option key={customer.CustomerID} value={customer.CustomerID}>
                {customer.CustomerName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-10 pr-16 pl-8 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
      >
        {/* {currentProducts.map((product) => ( */}

        {/* {filteredProducts.map((product) => ( */}
        {currentItems.map((product) => (
          <div
            className="relative transform transition-transform duration-500 hover:scale-105 w-full"
            key={product.productId}
          >
            <Product
              key={product.productId}
              productId={product.productId}
              productName={product.productName}
              productCode={product.productCode}
              productWeight={product.productWeight}
              productCustomerID={product.productCustomerID}
              productExpiryDate={product.productExpiryDate}
              productUrl={product.productUrl}
              onClick={() => handleEditDisplay(product)}
            />
          </div>
        ))}
        <div className="flex flex-col justify-center items-center">
          {!isFormVisible && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center"
              onClick={handleAddProduct}
            >
              <span className="text-2xl pb-1 leading-none">+</span>
            </button>
          )}
          {isFormVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-10">
              <form
                onSubmit={isEditingUser ? handleEdit : handleSubmit}
                className="space-y-6 bg-gray-100 shadow-xl rounded-lg p-8 w-full max-w-lg mx-auto"
              >
                {isEditingUser && (
                  <input
                    type="hidden"
                    name="productId"
                    value={editProduct.productId}
                  />
                )}

                <div className="flex flex-col">
                  <label
                    className="block text-gray-800 text-sm font-semibold mb-2"
                    htmlFor="productCode"
                  >
                    Product Code:
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-400 bg-white rounded-lg w-full py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="productCode"
                    id="productCode"
                    required
                    value={
                      isEditingUser
                        ? editProduct.productCode
                        : addProduct.productCode
                    }
                    onChange={(e) =>
                      isEditingUser
                        ? setEditProduct({
                            ...editProduct,
                            productCode: e.target.value,
                          })
                        : setAddProduct({
                            ...addProduct,
                            productCode: e.target.value,
                          })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    className="block text-gray-800 text-sm font-semibold mb-2"
                    htmlFor="productName"
                  >
                    Product Name:
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-400 bg-white rounded-lg w-full py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="productName"
                    id="productName"
                    required
                    value={
                      isEditingUser
                        ? editProduct.productName
                        : addProduct.productName
                    }
                    onChange={(e) =>
                      isEditingUser
                        ? setEditProduct({
                            ...editProduct,
                            productName: e.target.value,
                          })
                        : setAddProduct({
                            ...addProduct,
                            productName: e.target.value,
                          })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    className="block text-gray-800 text-sm font-semibold mb-2"
                    htmlFor="productWeight"
                  >
                    Product Weight:
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-400 bg-white rounded-lg w-full py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="productWeight"
                    id="productWeight"
                    required
                    value={
                      isEditingUser
                        ? editProduct.productWeight
                        : addProduct.productWeight
                    }
                    onChange={(e) =>
                      isEditingUser
                        ? setEditProduct({
                            ...editProduct,
                            productWeight: e.target.value,
                          })
                        : setAddProduct({
                            ...addProduct,
                            productWeight: e.target.value,
                          })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    className="block text-gray-800 text-sm font-semibold mb-2"
                    htmlFor="productCustomerID"
                  >
                    Product Customer ID:
                  </label>
                  {/* <input className="shadow appearance-none border border-gray-400 bg-white rounded-lg w-full py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline" type="text" name="productCustomerID" id="productCustomerID" required 
                    value={isEditingUser ? (editProduct.productCustomerID) : (addProduct.productCustomerID)} onChange={(e) => isEditingUser ? setEditProduct({ ...editProduct, productCustomerID: e.target.value }) : setAddProduct({ ...addProduct, productCustomerID: e.target.value })} /> */}
                  <select
                    className="shadow appearance-none border border-gray-400 bg-white rounded-lg w-full py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    name="productCustomerID"
                    id="productCustomerID"
                    required
                    value={
                      isEditingUser
                        ? editProduct.productCustomerID
                        : addProduct.productCustomerID
                    }
                    onChange={(e) =>
                      isEditingUser
                        ? setEditProduct({
                            ...editProduct,
                            productCustomerID: e.target.value,
                          })
                        : setAddProduct({
                            ...addProduct,
                            productCustomerID: e.target.value,
                          })
                    }
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option
                        key={customer.CustomerID}
                        value={customer.CustomerID}
                      >
                        {customer.CustomerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label
                    className="block text-gray-800 text-sm font-semibold mb-2"
                    htmlFor="productUrl"
                  >
                    Product Image Url:
                  </label>
                  <input
                    className="shadow appearance-none border border-gray-400 bg-white rounded-lg w-full py-2 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    name="productUrl"
                    id="productUrl"
                    required
                    value={
                      isEditingUser
                        ? editProduct.productUrl
                        : addProduct.productUrl
                    }
                    onChange={(e) =>
                      isEditingUser
                        ? setEditProduct({
                            ...editProduct,
                            productUrl: e.target.value,
                          })
                        : setAddProduct({
                            ...addProduct,
                            productUrl: e.target.value,
                          })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  {/* Uncomment if you need to upload an image
              <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="productImage">
                Product Image:
              </label>
              <input className="shadow appearance-none border border-gray-400 bg-white rounded-lg w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline" type="file" name="productImage" id="productImage" accept="image/*" required />
              */}
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                  >
                    {isEditingUser ? "Save" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormVisible(false);
                      setIsEditingUser(false);
                      setAddProduct({
                        productName: "",
                        productCode: "",
                        productWeight: "",
                        productCustomerID: "",
                        productExpiryDate: "",
                        productUrl: "",
                      });
                      setEditProduct({
                        productId: "",
                        productName: "",
                        productCode: "",
                        productWeight: "",
                        productCustomerID: "",
                        productExpiryDate: "",
                        productUrl: "",
                      });
                    }}
                    className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <br />
      <div className="flex items-center gap-2 align-middle justify-center">
        <button
          className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={() => {
            if (currentPage > 1) {
              paginate(currentPage - 1);
            }
          }}
        >
          Previous
        </button>
        <div className="pagination space-x-2">
          {!isFormVisible &&
            Array.from(Array(totalPages).keys()).map((number) => (
              <button
                className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
                key={number + 1}
                onClick={() => paginate(number + 1)}
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  {number + 1}
                </span>
              </button>
            ))}
        </div>
        <button
          className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={() => {
            if (currentPage < totalPages) {
              paginate(currentPage + 1);
            }
          }}
        >
          Next
        </button>
      </div>
      <br />
      <br />
    </div>
  );
}

export default ProductGrid;
