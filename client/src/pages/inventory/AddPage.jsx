import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddMatrialForm from '../../components/inventory/AddMatrialForm';
import AddProductForm from '../../components/inventory/AddProductFrom';
const AddPage = () => {
  const { t } = useTranslation();
  const [dataType, setDataType] = useState('products');
  return (
    <div>
      <h2
        className="text-center text-3xl font-bold"
        style={{ marginBlock: '1rem' }}
      >
       {t("add")} {dataType === 'products' ? t('product') : t('material')}
      </h2>
      <div
        className="materialTransactionsFilterNavbarItem mx-4"
        style={{ marginBottom: '2vh' }}
      >
        <label htmlFor="transactionType">{t('add')}:</label>
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
          <AddProductForm />
        ) : (
          <AddMatrialForm />
        )}
      </div>
    </div>
  );
};

export default AddPage;
