import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import ContactUs from '../../components/Operator/ContactUs';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import { apiRequest } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../../components/shared/Loading';
const ViewContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employee } = useSelector((state) => state?.employee);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await apiRequest({
          url: '/employees/operator/contactUs',
          method: 'GET',
          token: employee?.token,
        });
        setContacts(response.data.contactUs.reverse());
        console.log(response.data.contactUs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [employee?.token]);

  return (
    <div>
      <Toaster />
      <Typography variant="h4" align="center" style={{margin:"40px 0px"}}>
        {t('Customers Questions And Problems')}
      </Typography>
      {loading ? (
        <div className="h-60">
          <Typography variant="h6" align="center"><Loading /></Typography>
        </div>
      
      ) : contacts.length === 0 ? (
        <Typography variant="h6" align="center">
          {t('noRequestsAtTheMoment')}
        </Typography>
      ) : (
        <Grid container spacing={3}>
            <ContactUs key={contacts._id} contactUs={contacts} />
        </Grid>
      )}
    </div>
  );
};

export default ViewContactUs;
