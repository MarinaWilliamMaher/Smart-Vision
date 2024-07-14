import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { apiRequest } from '../../utils';
import {
  Grid,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { t } from 'i18next';

function TransactionMComponent() {
  const [transactions, setTransactions] = useState([]);
  const { employee } = useSelector((state) => state.employee);
  const [Matrials, setMatrials] = useState([{ material: '', quantity: '' }]);
  const newMaterialNameRef = useRef(null);
  const newMaterialQuantityRef = useRef(null);
  const [AllMatrials, setAllMatrials] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    materials: [],
    newMaterialName: '',
    newMaterialQuantity: '',
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await apiRequest({
          url: '/materials/',
          method: 'GET',
          token: employee?.token,
        });
        if (response?.data?.success) {
          setAllMatrials(response.data.materials);
          //console.log(response.data.materials);
        } else {
          toast.dismiss();
          toast.error('Failed to get materials');
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    const selectedMaterialsData = orderDetails.materials.map(
      (selectedMaterial) => {
        const material = AllMatrials.find(
          (material) => material.name === selectedMaterial.material
        );
        return {
          _id: material?._id,
          materialName: material?.name,
          materialARName: material?.ARName,
          quantity: selectedMaterial.quantity,
        };
      }
    );
    setMatrials(selectedMaterialsData);
    setTransactions(selectedMaterialsData);
  }, [AllMatrials, orderDetails.materials]);

  const addMaterial = () => {
    const { newMaterialName, newMaterialQuantity } = orderDetails;
    if (newMaterialName && newMaterialQuantity) {
      const existingMaterialIndex = orderDetails.materials.findIndex(
        (material) => material.materialName === newMaterialName
      );
      if (existingMaterialIndex !== -1) {
        const updatedMaterials = [...orderDetails.materials];
        updatedMaterials[existingMaterialIndex].quantity +=
          parseInt(newMaterialQuantity);
        setOrderDetails({
          ...orderDetails,
          materials: updatedMaterials,
          newMaterialName: '',
          newMaterialQuantity: '',
        });
      } else {
        setOrderDetails({
          ...orderDetails,
          materials: [
            ...orderDetails.materials,
            {
              material: newMaterialName,
              quantity: parseInt(newMaterialQuantity),
            },
          ],
          newMaterialName: '',
          newMaterialQuantity: '',
        });
      }
      newMaterialNameRef.current.value = '';
      newMaterialQuantityRef.current.value = '';
      newMaterialNameRef.current.blur();
      newMaterialQuantityRef.current.blur();
    }
  };

  const handleTransaction = async (method) => {
    const hasNullQuantity = Matrials.some(
      (material) => material.quantity === null || material.quantity === ''
    );

    if (hasNullQuantity) {
      toast.error(t('fillAllQuantities'));
      return;
    }
    try {
      const managerId = employee._id;
      console.log(transactions);
      const response = await apiRequest({
        method: 'PUT',
        url: '/materials/transaction',
        data: {
          managerId,
          materials: Matrials,
          method: method,
        },
        token: employee?.token,
      });
      if (response?.data?.success) {
        toast.success(t('Successful Transaction'));
        setTransactions([]);
        setOrderDetails({
          materials: [],
          newMaterialName: '',
          newMaterialQuantity: '',
        });
      } else {
        toast.error(t('FailedTryAgain'));
      }
    } catch (error) {
      console.error('Error making transaction:', error);
      toast.error(t('FailedTryAgain'));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (orderDetails.newMaterialName.trim() !== '') {
        addMaterial();
      }
    }
  };

  const removeMaterial = (index) => {
    const materials = [...orderDetails.materials];
    materials.splice(index, 1);
    setOrderDetails({ ...orderDetails, materials });
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="presenter-products-container"
      spacing={2}
    >
      <Toaster
        toastOptions={{
          style: {
            duration: 3000,
            border: '1px solid #6A5ACD',
            backgroundColor: '#6A5ACD',
            padding: '16px',
            color: 'white',
            fontWeight: 'Bold',
            marginTop: '65px',
            textAlign: 'center',
          },
        }}
      />
      <Grid item xs={12}>
        <Typography
          variant="h5"
          style={{
            padding: '20px 0px',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {t('materials')}:
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <Autocomplete
          options={AllMatrials}
          getOptionLabel={(option) => option.name}
          id="combo-box-demo"
          renderInput={(params) => (
            <>
              <TextField
                {...params}
                placeholder={t('name')}
                type="text"
                id="newMaterialName"
                name="newMaterialName"
                inputRef={newMaterialNameRef}
                value={orderDetails.newMaterialName}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  orderDetails.newMaterialName.trim() !== '' &&
                  newMaterialQuantityRef.current.focus()
                }
              />
            </>
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setOrderDetails({
                ...orderDetails,
                newMaterialName: newValue.name,
              });
            }
          }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          type="number"
          placeholder={t('quantity')}
          name="newMaterialQuantity"
          inputRef={newMaterialQuantityRef}
          value={orderDetails.newMaterialQuantity}
          onChange={handleChange}
          onKeyDown={handleQuantityKeyDown}
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <Button fullWidth onClick={addMaterial} style={{ marginTop: '10px' }}>
          {t('add')}
        </Button>
      </Grid>
      {orderDetails.materials.length > 0 && (
        <Grid item xs={12}>
          <List
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              paddingTop: '0px',
            }}
          >
            {orderDetails.materials.map((material, index) => (
              <ListItem key={index} style={{ paddingBottom: '0px' }}>
                <ListItemText primary={material.material} />
                <ListItemText secondary={material.quantity} />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeMaterial(index)}
                >
                  <DeleteForeverIcon
                    sx={{ fontSize: '32px' }}
                    style={{ marginRight: '3vw' }}
                  />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          style={{
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleTransaction('Export')}
            style={{ backgroundColor: '#edede9', color: 'black' }}
          >
            {t('export')}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleTransaction('Import')}
            style={{
              marginInline: '70px',
              backgroundColor: '#edede9',
              color: 'black',
            }}
          >
            {t('import')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TransactionMComponent;
