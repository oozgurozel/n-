import React from "react";

const ProcessFlow = () => {
  return (
    <div className="bg-black text-white flex flex-col items-center py-16">
      <div className="text-center mb-12">
        <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">
          SÜREÇ
        </div>
        <h2 className="text-4xl font-light" style={{ color: '#B99671' }}>
          Sürecimiz
        </h2>
      </div>

      <div className="relative w-full max-w-5xl flex flex-col items-center">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-20 bottom-0 w-[1px] bg-gray-700"></div>

        {/* Step 1 */}
        <div className="relative z-10 mb-16 w-full flex justify-start items-center">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-5 bg-black rounded-full w-8 h-8 flex items-center justify-center text-sm text-gray-500">
            01
          </div>
          <div className="w-1/2 pl-8">
            <div
              className="p-8 rounded-md w-fit text-left"
              style={{ backgroundColor: 'rgba(218, 197, 167, 0.06)' }}
            >
              <h3 className="text-lg font-medium text-[#C19A6B] mb-2">
                DANIŞMA VE VAKA DEĞERLENDİRME
              </h3>
              <p className="text-sm" style={{ color: '#B99671' }}>
                Çalışma sürecimizdeki ilk adım, deneyimli avukatlarımızdan biriyle bir
                danışma görüşmesi planlamaktır.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 mb-16 w-full flex justify-end items-center">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-5 bg-black rounded-full w-8 h-8 flex items-center justify-center text-sm text-gray-500">
            02
          </div>
          <div className="w-1/2 pr-8">
            <div
              className="p-8 rounded-md w-fit text-right"
              style={{ backgroundColor: 'rgba(218, 197, 167, 0.06)' }}
            >
              <h3 className="text-lg font-medium text-[#C19A6B] mb-2">
                STRATEJİK PLANLAMA VE TEMSİL
              </h3>
              <p className="text-sm" style={{ color: '#B99671' }}>
                Davanızı değerlendirdikten ve hedeflerinizi belirledikten sonra,
                mümkün olan en iyi sonuca ulaşmak için stratejik bir plan
                geliştireceğiz.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 w-full flex justify-start items-center">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-5 bg-black rounded-full w-8 h-8 flex items-center justify-center text-sm text-gray-500">
            03
          </div>
          <div className="w-1/2 pl-7">
            <div
              className="p-8 rounded-md w-fit text-left"
              style={{ backgroundColor: 'rgba(218, 197, 167, 0.06)' }}
            >
              <h3 className="text-lg font-medium text-[#B99671] mb-2">
                ÇÖZÜM VE TAKİP
              </h3>
              <p className="text-sm" style={{ color: '#B99671' }}>
                Çalışma sürecimizin son aşamasında, hedeflerinizi karşılayan ve yasal
                ihtiyaçlarınızı tatmin eden bir çözüme ulaşmaya odaklanacağız.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlow;