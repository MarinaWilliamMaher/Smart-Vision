import {
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../components/shared/Loading';
import { useEffect, useState } from 'react';
import EmployeeCard from '../../components/actorManager/EmployeeCard';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import i18n from '../../../Language/translate';
import { apiRequest } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
function ViewEmployees() {
  const { t } = useTranslation(); // Initialize the useTranslation hook

  const [employees, setEmployees] = useState([]);
  const { employee } = useSelector((state) => state?.employee);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTitle, setJobTitle] = useState('All');
  const [Display, setDisplay] = useState('none');
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiRequest({
          url: '/employees/actor/',
          method: 'GET',
          token: employee?.token,
        });
        if (response?.data.success) {
          console.log('API response:', response?.data?.employees);
          setEmployees(response.data.employees);
          setIsLoading(false);
        } else {
          toast.error('Error fetching products:', response?.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error.response.data.message);
      }
    };

    fetchEmployees();
  }, []);
  const filteredEmployees = employees.filter((employee) => {
    const searchString = searchTerm.toLowerCase();
    const customerName = `${employee?.username}`.toLowerCase();
    const customerPhone = `0${employee?.phone}`.toLowerCase();

    // Filter based on search term and selected service type
    return (
      (jobTitle === 'All' ||
        employee.jobTitle.toLowerCase() === jobTitle.toLowerCase()) &&
      (customerName.includes(searchString) ||
        customerPhone.includes(searchString))
    );
  });

  // Handler function to update selected service type
  const handleJobTitleChange = (event) => {
    setJobTitle(event.target.value);
  };
  return (
    <Grid container justifyContent="center" alignItems="center">
      {' '}
      {isLoading ? (
        <Grid item>
          <Loading />
        </Grid>
      ) : employees.length > 0 ? (
        <Grid item container xs={12} sm={10} md={10}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              style={{
                marginBottom: '3rem',
              }}
            >
              {t('EmployeesOfTheCompany')}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              margin: 'auto',
              marginBottom: '2rem',
              marginLeft: {
                xs: 'auto',
                sm: i18n.language === 'ar' ? '100vw' : '0rem',
                md: i18n.language === 'ar' ? '100vw' : '-2rem',
              },
              maxWidth: { xs: '90vw', sm: '500px' },
              display: 'flex',
              gap: '1rem',
            }}
          >
            <TextField
              select
              label={t('JobTitle')}
              value={jobTitle}
              onChange={handleJobTitleChange}
              variant="outlined"
              style={{ minWidth: '150px' }}
            >
              <MenuItem value="All">{t('All')}</MenuItem>
              <MenuItem value="Operator">{t('Operator')}</MenuItem>
              <MenuItem value="Engineer">{t('Engineer')}</MenuItem>
              <MenuItem value="Inventory Manager">
                {t('Inventory Manager')}
              </MenuItem>
              <MenuItem value="Actor Manager">{t('Actor Manager')}</MenuItem>
              <MenuItem value="Presenter">{t('Presenter')}</MenuItem>
              <MenuItem value="Factory">{t('Factory')}</MenuItem>
            </TextField>
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              placeholder={t('EnterYourSearch')}
              sx={{
                minWidth: {
                  xs: '50%',
                  sm: i18n.language === 'ar' ? '100%' : '50%',
                },
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm && (
                      <IconButton
                        edge="end"
                        aria-label={t('ClearSearch')}
                        onClick={(e) => setSearchTerm('')}
                      >
                        <ClearIcon color="action" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
                style: { backgroundColor: 'white', borderRadius: '5px' },
              }}
            />
          </Grid>
          <Grid
            container
            spacing={3}
            align="center"
            sx={{ justifyContent: { xs: 'center', md: 'space-evenly' } }}
          >
            {filteredEmployees.map((employee, index) => (
              <Grid item key={index}>
                <EmployeeCard employee={employee} t={t} />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              height: 50,
              transform: 'translateZ(0px)',
              flexGrow: 1,
              position: 'fixed',
              bottom: 40,
              right: 20,
            }}
          >
            <span
              style={{
                position: 'relative',
                right: 85,
                bottom: 7,
                display: Display,
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                backgroundColor: 'rgba(0, 0, 0,0.6)',
              }}
            >
              {t('AddNewEmployee')}
            </span>
            <Link to={'/actor/add-employee'}>
              <SpeedDial
                ariaLabel={t('SpeedDialBasicExample')}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                direction="up"
                open={false}
                onMouseOver={() => setDisplay('inline')}
                onMouseLeave={() => setDisplay('none')}
              ></SpeedDial>
            </Link>
          </Box>
        </Grid>
      ) : (
        <Grid item xs={12} sm={8}>
          <Typography variant="h5" align="center" gutterBottom>
            {t("There'sNoEmployees")}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default ViewEmployees;
