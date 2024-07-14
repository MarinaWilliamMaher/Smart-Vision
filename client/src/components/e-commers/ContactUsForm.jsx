import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../shared/Loading';
import axios from 'axios';
import { handleFileUpload } from '../../utils';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function ContactUsForm() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();
  const handleSubmitForm = async (data) => {
    try {
      const { name, email, message, phone } = data;
      const picture = image && (await handleFileUpload(image));
      console.log(picture);
      await axios
        .post('/customers/contactUs', {
          name,
          email,
          message,
          phone,
          picture,
        })
        .then((res) => {
          toast.dismiss();
          toast(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      setError('root', {
        message: `${error.message}`,
      });
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="flex flex-wrap flex-col -m-2 sm:flex-row"
      onSubmit={handleSubmit(handleSubmitForm)}
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
      <div className="p-2 sm:w-1/2 ">
        <div className="relative">
          <label htmlFor="name" className="leading-7 text-sm text-gray-600">
            {t('Name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            {...register('name', {
              required: 'name is required',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{t(errors.name.message)}</div>
          )}
        </div>
      </div>
      <div className="p-2 sm:w-1/2">
        <div className="relative">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">
            {t('Email')} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            {...register('email', {
              required: t('Email Address is required'),
              validate: (value) => {
                if (!value.includes('@')) {
                  return t('Email must include @');
                }
                return true;
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{t(errors.email.message)}</div>
          )}
        </div>
      </div>
      <div className="p-2 sm:w-full">
        <div className="relative">
          <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
            {t('Phone Number')} *
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            {...register('phone', {
              required: t('Phone Number is required'),
            })}
          />
          {errors.email && (
            <div className="text-red-500">{t(errors.email.message)}</div>
          )}
        </div>
      </div>
      <div className="p-2 w-full">
        <div className="relative">
          <label htmlFor="message" className="leading-7 text-sm text-gray-600">
            {t('Message')} *
          </label>
          <textarea
            id="message"
            name="message"
            className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            {...register('message', {
              required: 'message is required',
            })}
          ></textarea>
          {errors.message && (
            <div className="text-red-500">{t(errors.message.message)}</div>
          )}
        </div>
      </div>
      <div className="p-2 w-full">
        <div className="relative flex justify-items-center gap-2">
          <label
            htmlFor="uploadFile"
            className="leading-7 text-sm text-gray-600 mt-1"
          >
            {t('uploadFile')}
          </label>
          <input
            type="file"
            id="uploadFile"
            name="uploadFile"
            className="uploadBtn file:hidden text-gray-700 bg-gray-300 w-1/4"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
      </div>
      <div className="p-2 w-full">
        {isSubmitting ? (
          <Loading />
        ) : (
          <button
            disabled={isSubmitting}
            className="flex mx-auto text-white bg-indigo-700 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-900 rounded text-lg"
          >
            {t('Send')}
          </button>
        )}
      </div>
    </form>
  );
}

export default ContactUsForm;
