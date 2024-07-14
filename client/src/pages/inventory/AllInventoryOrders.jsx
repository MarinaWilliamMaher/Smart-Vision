import React, { useState, useEffect } from 'react';
import InventoryMatrialsOrders from './InventoryMatrialsOrders';
import InventoryProductOrders from './InventoryProductOrders';
import { useTranslation } from 'react-i18next';

const AllInventoryOrders = () => {
  const { t } = useTranslation();
  const [dataType, setDataType] = useState('products');
  //console.log(products);
  return (
    <div>
      <h2
        className="text-center text-3xl font-bold"
        style={{ marginBlock: '1rem' }}
      >
        {dataType === 'products' ? t('products') : t('materials')}
      </h2>
      <div
        className="materialTransactionsFilterNavbarItem mx-4"
        style={{ marginBottom: '2vh' }}
      >
        <label htmlFor="transactionType">{t('selectType')}:</label>
        <select
          name="transactionType"
          id="transactionType"
          onChange={(e) => setDataType(e.target.value)}
          value={dataType}
        >
          <option value="products">{t('products')}</option>
          <option value="materials">{t('materials')}</option>
        </select>
      </div>
      <div>
        {dataType === 'products' ? (
          <InventoryProductOrders />
        ) : (
          <InventoryMatrialsOrders />
        )}
      </div>
    </div>
  );
};

export default AllInventoryOrders;
