import React from "react";
import { Icon } from "@iconify/react";
import "./StyleSheets/ContactUs.css";
import ContactUsForm from "../../components/e-commers/ContactUsForm";
import { useTranslation } from "react-i18next";

function ContactUs() {
  const { t } = useTranslation();

  return (
    <section className="text-gray-600 body-font relative">
      <div id="google_translate_element" className="flex justify-end"></div>
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-col text-center w-full mb-8">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            {t("Contact Us")}
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base ">
            {t(
              "If you have any problem or anythink you can contact with us easily"
            )}
          </p>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <ContactUsForm />
          <div className="flex flex-wrap flex-col -m-2 sm:flex-row">
            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
              <a className="text-indigo-500 flex justify-center items-center gap-2">
                <Icon icon="icon-park:email-block" width="30" height="30" />
                <span className="hover:underline cursor-pointer">
                  smart.vision77@hotmail.com
                </span>
              </a>
              <p className="leading-normal my-5 flex justify-center items-center gap-2">
                <Icon
                  icon="mdi:location-radius-outline"
                  className="text-red-600"
                  width="30"
                  height="30"
                />
                <span>٢٨ش مصطفى النحاس أمام صادكو - مدينة نصر – القاهرة</span>
              </p>
              <p className="leading-normal my-5 flex justify-center items-center gap-2 ">
                <Icon icon="twemoji:flag-egypt" />
                <span>20+ 01111226783</span>
              </p>

              <span className="inline-flex">
                <a
                  href="https://www.facebook.com/smartvision77"
                  target="_blank"
                  className="text-gray-500"
                >
                  <Icon icon="logos:facebook" width="30" height="30" />
                </a>
                <a className="ml-4 text-gray-500">
                  <Icon icon="logos:twitter" width="30" height="30" />
                </a>
                <a className="ml-4 text-gray-500">
                  <Icon icon="skill-icons:instagram" width="30" height="30" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
