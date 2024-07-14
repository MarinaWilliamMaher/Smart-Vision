import React, { useState, useEffect } from 'react';
import HomeComponent from '../../components/inventory/HomeComponent';
import MatrialComponnent from '../../components/inventory/MatrialComponnent';
import Loading from '../../components/shared/Loading';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const InventoryHome = () => {
  const { t } = useTranslation();
  const { employee } = useSelector((state) => state?.employee);
  const [dataType, setDataType] = useState('products');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/inventory/Add');
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = dataType === 'products' ? '/products/all' : '/materials/';
        const response = await apiRequest({
          url: url,
          method: 'GET',
          token: employee?.token,
        });
        if (response?.data?.success) {
          setData(response?.data[dataType]);
          setIsLoading(false);
          console.log(response?.data[dataType]);
        } else {
          toast.error(`Error fetching ${dataType}`);
          isLoading(false);
        }
      } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
        isLoading(false);
      }
    };

    fetchData();
  }, [dataType]);
  return (
    <div>
      <Toaster />
      <h2
        className="text-center text-3xl font-bold"
        style={{ marginBlock: '1rem' }}
      >
        {t('all')} {dataType === 'products' ? t('products') : t('materials')}
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
      {isLoading ? (
        <div className="h-72">
          <Loading />
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {dataType === 'products' ? (
            <HomeComponent Allproducts={data} />
          ) : (
            <MatrialComponnent AllMaterials={data} />
          )}
        </div>
      )}
      <Box
        sx={{
          height: 320,
          transform: 'translateZ(0px)',
          flexGrow: 1,
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={handleClick}
        >
        </SpeedDial>
      </Box>
    </div>
  );
};

export default InventoryHome;
