import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../utils';
import { useSelector } from 'react-redux';
function MatrialComponnent({ AllMaterials }) {
  const { t } = useTranslation();
  const language = JSON.parse(window?.localStorage.getItem('language'));
  const [Matrials, setMatrials] = useState(AllMaterials);
  const { employee } = useSelector((state) => state?.employee);

  const handleDelete = async (matrialId) => {
    try {
      const response = await apiRequest({
        url: '/materials/',
        method: 'DELETE',
        data: { id: matrialId },
        token: employee?.token,
      });
      if (response?.data?.success) {
        setMatrials((prevMatrials) =>
          prevMatrials.filter((Matrial) => Matrial._id !== matrialId)
        );
        toast.dismiss();
        toast.success(response?.data?.message);
      } else {
        toast.dismiss();
        toast.error('Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting matrial:', error);
      toast.error('Failed to delete matrial. Please try again.');
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className="presenter-products-container"
    >
      <Toaster />
      {Matrials?.length > 0 ? (
        <Grid item xs={12} sm={10} md={10}>
          <Grid
            container
            spacing={3}
            className="presenter-products"
            align="center"
            justifyContent="center"
          >
            {Matrials?.map((matrial, index) => (
              <Grid key={index} item xs={12} md={6} lg={4}>
                <Card
                  sx={{ maxWidth: 300 }}
                  style={{ backgroundColor: '#eaf4f4' }}
                >
                  <CardHeader
                    title={language === 'en' ? matrial?.name : matrial?.ARName}
                    style={{ marginTop: '10px' }}
                  />
                  <CardContent style={{ marginTop: '-20px' }}>
                    {t('quantity')}: {matrial?.quantity}
                  </CardContent>
                  <CardActions
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <IconButton style={{ color: '#cce3de' }}>
                      <Link to={`/inventory/update/matrial/${matrial?._id}`}>
                        <EditIcon style={{ color: '#495057' }} />
                      </Link>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(matrial?._id)}>
                      <DeleteIcon style={{ color: '#495057' }} />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : (
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            width: '45%',
            border: '2px solid #a8a8a8',
            paddingBlock: '20px',
            marginTop: '2rem',
            borderRadius: '10px',
            color: '#a8a8a8',
          }}
        >
          <p style={{ marginBottom: '12px' }}>{t('thereIsNoMaterials')}</p>
          <Link to="/inventory/add/matrial">
            <Button variant="contained" color="primary">
              {t('add')} {t('materials')}
            </Button>
          </Link>
        </div>
      )}
    </Grid>
  );
}

export default MatrialComponnent;
