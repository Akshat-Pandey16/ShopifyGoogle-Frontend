import React, { useEffect, useState } from "react";
import {
  GetShopifyProducts,
  setAuthToken,
  CreateSheet,
  GetSheets,
  AddtoSheet,
} from "./ApiService";

interface Sheet {
  spreadsheet_id: string;
  spreadsheet_name: string;
}

const ShopifyGoogle: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [sheetName, setSheetName] = useState("");
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [selectedSheetIds, setSelectedSheetIds] = useState<string[]>([]);

  const handleSheetNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSheetName(event.target.value);
  };

  useEffect(() => {
    GetGoogleSheet();
  }, []);

  const getProducts = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    setAuthToken(token);
    try {
      const response = await GetShopifyProducts();
      const data = await response.data;
      console.log(data);
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching Shopify products:", error);
    }
  };

  const CreateGoogleSheet = async () => {
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      const response = await CreateSheet(sheetName);
      console.log(response.data);
      GetGoogleSheet();
    } catch (error) {
      console.error("Error adding products to Google Sheet:", error);
    }
  };

  const GetGoogleSheet = async () => {
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      const response = await GetSheets();
      setSheets(response.data);
    } catch (error) {
      console.error("Error fetching Google Sheets:", error);
    }
  };

  const UpdateGoogleSheet = async () => {
    try {
      const token = localStorage.getItem("token");
      setAuthToken(token);
      for (const sheetId of selectedSheetIds) {
        const response = await AddtoSheet(sheetId, products, 1);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error updating Google Sheet:", error);
    }
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    sheetId: string
  ) => {
    if (event.target.checked) {
      setSelectedSheetIds([sheetId]);
    } else {
      setSelectedSheetIds([]);
    }
  };

  const renderProducts = () => {
    return products.map((product, index) => (
      <div
        key={index}
        className="flex border border-gray-300 rounded-md p-4 mb-4"
      >
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="w-40 h-40 mr-4 rounded-md object-cover"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
          <p className="mb-2">
            <strong>Vendor:</strong> {product.vendor}
          </p>
          <p className="mb-2">
            <strong>Type:</strong> {product.product_type}
          </p>
          <ul className="list-disc list-inside mb-4">
            {product.variants.map((variant: any, idx: number) => (
              <li key={idx}>
                <p>
                  <strong>Variant:</strong> {variant.title}
                </p>
                <p>
                  <strong>Price:</strong> ${variant.price}
                </p>
                <p>
                  <strong>Inventory ID:</strong> {variant.inventory_id}
                </p>
                <p>
                  <strong>Inventory Quantity:</strong>{" "}
                  {variant.inventory_quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ));
  };



  return (
    <div className="flex flex-col justify-center max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Shopify Google</h1>
      <div className="flex mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 mb-2 hover:bg-blue-600"
          onClick={getProducts}
        >
          Get Shopify Products
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4 mb-2 hover:bg-blue-600"
          onClick={GetGoogleSheet}
        >
          Get Existing Sheets
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Existing Sheets:</h2>
        <ul>
          {sheets.map((sheet, index) => (
            <li key={index} className="mb-2">
              <input
                type="checkbox"
                onChange={(event) =>
                  handleCheckboxChange(event, sheet.spreadsheet_id)
                }
                className="mr-2"
              />
              <span className="text-gray-400">Spreadsheet ID:</span>{" "}
              {sheet.spreadsheet_id}
              <br />
              <span className="text-gray-400">Spreadsheet Name:</span>{" "}
              {sheet.spreadsheet_name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter sheet name"
          value={sheetName}
          onChange={handleSheetNameChange}
          className="text-bold text-gray-700 rounded-md py-2 px-4 mr-2 focus:ring-2 focus:ring-violet-300"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={CreateGoogleSheet}
        >
          Create Sheet
        </button>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-3 rounded-md mb-4 hover:bg-blue-600"
        onClick={UpdateGoogleSheet}
      >
        Update Sheet
      </button>
      <h2 className="text-2xl font-semibold mb-4">Products:</h2>
      {renderProducts()}
    </div>
  );
};

export default ShopifyGoogle;
