import React from "react";

const FAQ = () => {
  return (
    <section className="dark:bg-[#f7eedd] md:w-[90vw] rounded-lg mb-10 lg:w-[80vw] mx-auto dark:text-black">
      <div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
        <p className="p-2 text-sm font-medium tracking-wider text-center uppercase">
          How it works
        </p>
        <h2 className="mb-12 text-4xl font-bold leading-none text-center sm:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 dark:divide-gray-700">
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
            How does carpooling work?
            </summary>
            <div className="px-4 pb-4">
              <p>
              Carpooling typically works by bringing together individuals who share similar commuting routes and schedules,
               allowing them to share a single vehicle for their journeys instead of driving alone. 
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
            Is carpooling safe?
            </summary>
            <div className="px-4 pb-4">
              <p>
              Yes, it's safe. Drivers are verified by their driving licenses, 
              and there is also a rating system for co-riders and drivers based on their behavior
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
            How much does it cost to carpool?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
              The cost of carpooling or the ride depends on the distance you have to travel. 
              Passengers are charged based on the rate set by the driver per meter.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
            What if I need to cancel or change my ride or How do I find carpooling partners?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                You will money will refund to your bank account
              </p>
              <p>
              You have to go to the 'Find Ride' section and set your destination, date, and time. 
              After that,various rides that are available are shown on the Google Maps
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
            Can I carpool with strangers?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
              No, there is also a chat service available between co-riders and the drivers, 
              where you can ask questions or chat with your co-riders.
              </p>
              <p>
              There is also a rating system on a scale of 5,
               which shows their behavior in past rides
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
            How can I report any issues or concerns?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                You can report your concern on the 
                feedback or on our mail.
              </p>
            </div>
          </details>
          <details>
            <summary className="py-2 outline-none cursor-pointer focus:underline">
            Do I need to share driving responsibilities?
            </summary>
            <div className="px-4 pb-4 space-y-2">
              <p>
                Yes, you can also publish the rides if you want 
                you have to give the your driving licence number for 
                verification
              </p>
              <p>
                You have to go on publish rides section and 
                give your destination ,date and timing 
                you can select a particular roots shown on the map.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
