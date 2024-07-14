import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServicesCard from '../../components/e-commers/ServicesCard';
import { useTranslation } from 'react-i18next';
import i18n from '../../../Language/translate';
function Services() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const services = [
    {
      image_url: '/assemblyService.png',
      title: 'Assembly service',
      link: '/',
      description:
        'We offer a professional assembly service for your furniture,  ensuring a seamless experience tailored to your preferences.',
    },
    {
      image_url: '/deliveryServices.png',
      title: 'Delivery services',
      link: '/',
      description:
        'If you want to move your home furniture from one place to another, We offer a convenient furniture delivery service to get your belongings exactly where you need them.',
    },
    {
      image_url: '/kitchenServices.png',
      title: 'Desgins services',
      link: '/',
      description:
        'The design service offers expert guidance to transform your vision into reality. We collaborate closely with you to understand your needs and preferences, crafting a customized design plan that maximizes functionality and aesthetics. Whether you need a complete overhaul or a refresh for a specific area, our experienced designers are here to bring your dream space to life.',
    },
    {
      image_url: '/installationService.png',
      title: 'Customization Service',
      link: '/',
      description:
        'The customization service empowers you to create furniture that perfectly meets your unique style. Choose from a wide range of options, including materials, finishes, and even configurations, to design a piece that reflects your individual taste.  This service allows you to personalize your furniture and create a truly one-of-a-kind statement piece for your home.',
    },
    {
      image_url: '/measuringService.png',
      title: 'Measuring Service',
      link: '/',
      description:
        'The measuring service ensures accuracy and efficiency in calculating the dimensions of your chosen area. The price of this service is determined by the location and dimensions of the area that needs to be measured. This ensures you receive a fair and transparent quote based on your specific needs.',
    },
    {
      image_url: '/pickingService.png',
      title: 'Packing Service',
      link: '/',
      description:
        'Ensure a smooth and stress-free move with our comprehensive packing service. Our experienced team uses high-quality materials and expert packing techniques to keep your belongings safe during transport.',
    },
  ];

  const handleServiceClick = (service) => {
    // Navigate to the ServicesDetails page when a service is clicked
    navigate(`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`, {
      state: { service },
    });
  };
  return (
    <section className="container">
      <div className="mb-5">
        <h2 className="text-3xl font-bold mt-5 mb-3">{t('Our services')}</h2>
        <p className="text-gray-600 md:w-2/4">
          {t(
            'The company provides a variety of options; choose the service that best fits your needs.'
          )}
        </p>
      </div>
      {/* Services Cards */}
      <div className="w-full h-full  flex flex-col sm:flex-row md:justify-between flex-wrap ">
        <ServicesCard services={services} onServiceClick={handleServiceClick} />
      </div>
    </section>
  );
}

export default Services;
