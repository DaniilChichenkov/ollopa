import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/dashboardManageLocation";
import { ArrowLeft, Pen, Plus, Trash } from "lucide-react";
import { Form } from "react-router";

export type Location = {
  id: number;
  address: string;
  phone: string;
  weekHoursFrom: string;
  weekHoursTo: string;
  weekendHoursFrom: string;
  weekendHoursTo: string;
};

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(key);
  }

  return value.trim();
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { getAllLocations } = await import("~/db/location.server");

  try {
    const locations = getAllLocations();
    return {
      success: true,
      locations,
    };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  // Change location item
  if (request.method === "PATCH") {
    const formData = await request.formData();

    try {
      const address = getRequiredString(formData, "address");
      const tel = getRequiredString(formData, "tel");
      const weekHoursFrom = getRequiredString(formData, "weekHoursFrom");
      const weekHoursTo = getRequiredString(formData, "weekHoursTo");
      // const weekendHoursFrom = getRequiredString(formData, "weekendHoursFrom");
      // const weekendHoursTo = getRequiredString(formData, "weekendHoursTo");
      const itemToChange = getRequiredString(formData, "itemToChange");

      const weekendHoursFrom =
        (formData.get("weekendHoursFrom") as string) ?? "";
      const weekendHoursTo = (formData.get("weekendHoursTo") as string) ?? "";

      const { updateLocation } = await import("~/db/location.server");
      updateLocation(
        +itemToChange,
        address,
        tel,
        weekHoursFrom,
        weekHoursTo,
        weekendHoursFrom,
        weekendHoursTo,
      );

      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }

    // Create location item
  } else if (request.method === "POST") {
    // Get form fields
    const formData = await request.formData();

    const { createLocation } = await import("~/db/location.server");

    try {
      const address = getRequiredString(formData, "address");
      const tel = getRequiredString(formData, "tel");
      const weekHoursFrom = getRequiredString(formData, "weekHoursFrom");
      const weekHoursTo = getRequiredString(formData, "weekHoursTo");
      // const weekendHoursFrom = getRequiredString(formData, "weekendHoursFrom");
      // const weekendHoursTo = getRequiredString(formData, "weekendHoursTo");

      const weekendHoursFrom =
        (formData.get("weekendHoursFrom") as string) ?? "";
      const weekendHoursTo = (formData.get("weekendHoursTo") as string) ?? "";

      createLocation(
        address,
        tel,
        weekHoursFrom,
        weekHoursTo,
        weekendHoursFrom,
        weekendHoursTo,
      );

      return { success: true };
    } catch (error) {
      return { success: false };
    }

    // Delete location
  } else if (request.method === "DELETE") {
    // Get form fields
    const formData = await request.formData();

    const { deleteLocation } = await import("~/db/location.server");

    try {
      const itemToDelete = getRequiredString(formData, "itemToDelete");

      deleteLocation(+itemToDelete);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
};

const DashboardManageLocation = ({
  actionData,
  loaderData,
}: Route.ComponentProps) => {
  const newLocationModal = useRef<HTMLDialogElement>(null);
  const openModal = () => {
    newLocationModal.current?.showModal();
  };

  const changeLocationModalRef = useRef<HTMLDialogElement>(null);
  const [locationToChange, setLocationToChange] = useState<Location | null>(
    null,
  );

  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const deleteLocationModalRef = useRef<HTMLDialogElement>(null);

  // Close modal if form was submitted successfully
  useEffect(() => {
    if (actionData?.success) {
      changeLocationModalRef.current?.close();
      setLocationToChange(null);
      newLocationModal.current?.close();
      deleteLocationModalRef.current?.close();
    }
  }, [actionData]);

  // Open change location modal window
  const openChangeModal = (location: Location) => {
    setLocationToChange(location);
    changeLocationModalRef.current?.showModal();
  };

  // Open delete location modal
  const openDeleteModal = (id: number) => {
    setLocationToDelete(() => id);
  };

  useEffect(() => {
    if (deleteLocationModalRef.current) {
      if (locationToDelete === null) {
        if (deleteLocationModalRef.current.open) {
          deleteLocationModalRef.current.close();
        }
      } else {
        deleteLocationModalRef.current.showModal();
      }
    }
  }, [locationToDelete]);

  return (
    <div className="w-full min-h-screen p-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center gap-x-3 border-2 border-base-300 p-4 rounded-xl">
        <p className="text-lg">Müügikohad</p>

        <button onClick={openModal} className="btn btn-primary">
          <Plus /> Lisa müügikoht
        </button>
      </header>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 xl:grid-cols-3 mt-10">
        {loaderData?.locations?.map((location) => (
          <div
            key={location.id}
            className="w-full border-2 border-base-300 p-4 rounded-xl flex justify-between items-center"
          >
            <p className="font-semibold">{location.address}</p>

            <div className="flex justify-end items-center gap-x-2">
              <button onClick={() => openChangeModal(location)} className="btn">
                <Pen />
              </button>

              <button
                onClick={() => openDeleteModal(location.id)}
                className="btn btn-error"
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Change location modal */}
      <dialog
        ref={changeLocationModalRef}
        id="my_modal_1"
        className="modal"
        onClose={() => setLocationToChange(null)}
      >
        {locationToChange ? (
          <div className="modal-box">
            <h3 className="font-bold text-lg">Muuda müügikoha andmeid</h3>

            {/* Form */}
            <Form
              id="changeLocationForm"
              className="w-full mt-5"
              method="PATCH"
              action="."
            >
              <input
                type="hidden"
                name="itemToChange"
                value={locationToChange.id}
              />

              {/* Address */}
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Aadress</legend>

                <input
                  required
                  type="text"
                  className="input w-full"
                  placeholder="Nt: Aia 10, Narva-Jõesuu"
                  name="address"
                  defaultValue={locationToChange.address}
                />
              </fieldset>

              {/* Tel */}
              <fieldset className="fieldset w-full mt-5">
                <legend className="fieldset-legend">Telefon</legend>

                <label className="input w-full">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                  >
                    <g fill="none">
                      <path
                        d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                        fill="currentColor"
                      ></path>

                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>

                  <input
                    type="tel"
                    className="w-full"
                    required
                    placeholder="Nt: +37255555555"
                    name="tel"
                    defaultValue={locationToChange.phone}
                  />
                </label>
              </fieldset>

              {/* Working hours (Week) */}
              <fieldset className="fieldset mt-5 w-full flex justify-between items-center">
                <legend className="fieldset-legend">
                  Lahtiolekuajad tööpäevadel (E–R)
                </legend>

                {/* From */}
                <div className="w-5/12">
                  <p className="lael">Alates:</p>

                  <input
                    type="time"
                    className="input"
                    name="weekHoursFrom"
                    required
                    defaultValue={locationToChange.weekHoursFrom}
                  />
                </div>

                {/* To */}
                <div className="w-5/12">
                  <p className="lael">Kuni:</p>

                  <input
                    type="time"
                    className="input"
                    name="weekHoursTo"
                    required
                    defaultValue={locationToChange.weekHoursTo}
                  />
                </div>
              </fieldset>

              {/* Working hours (Weekend) */}
              <fieldset className="fieldset mt-5 w-full flex justify-between items-center">
                <legend className="fieldset-legend">
                  Lahtiolekuajad nädalavahetusel (L–P)
                </legend>

                {/* From */}
                <div className="w-5/12">
                  <p className="lael">Alates:</p>

                  <input
                    type="time"
                    className="input"
                    name="weekendHoursFrom"
                    defaultValue={locationToChange.weekendHoursFrom}
                  />
                </div>

                {/* To */}
                <div className="w-5/12">
                  <p className="lael">Kuni:</p>

                  <input
                    type="time"
                    className="input"
                    name="weekendHoursTo"
                    defaultValue={locationToChange.weekendHoursTo}
                  />
                </div>
              </fieldset>
            </Form>

            {/* Options */}
            <div className="w-full flex justify-between items-center mt-10">
              <div className="modal-action mt-0">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">
                    <ArrowLeft /> Tagasi
                  </button>
                </form>
              </div>

              <button form="changeLocationForm" className="btn btn-primary">
                Salvesta
              </button>
            </div>
          </div>
        ) : null}
      </dialog>

      {/* New Location modal */}
      <dialog ref={newLocationModal} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Lisa uus müügikoht</h3>

          {/* Form */}
          <Form
            action="."
            method="POST"
            id="newLocationForm"
            className="w-full mt-5"
          >
            {/* Address */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Aadress</legend>

              <input
                required
                type="text"
                className="input w-full"
                placeholder="Nt: Aia 10, Narva-Jõesuu"
                name="address"
              />
            </fieldset>

            {/* Tel */}
            <fieldset className="fieldset w-full mt-5">
              <legend className="fieldset-legend">Telefon</legend>

              <label className="input w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                >
                  <g fill="none">
                    <path
                      d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                      fill="currentColor"
                    ></path>

                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>

                <input
                  type="tel"
                  className="w-full"
                  required
                  placeholder="Nt: +37255555555"
                  name="tel"
                />
              </label>
            </fieldset>

            {/* Working hours (Week) */}
            <fieldset className="fieldset mt-5 w-full flex justify-between items-center">
              <legend className="fieldset-legend">
                Lahtiolekuajad tööpäevadel (E–R)
              </legend>

              {/* From */}
              <div className="w-5/12">
                <p className="lael">Alates:</p>

                <input
                  type="time"
                  className="input"
                  name="weekHoursFrom"
                  required
                />
              </div>

              {/* To */}
              <div className="w-5/12">
                <p className="lael">Kuni:</p>

                <input
                  type="time"
                  className="input"
                  name="weekHoursTo"
                  required
                />
              </div>
            </fieldset>

            {/* Working hours (Weekend) */}
            <fieldset className="fieldset mt-5 w-full flex justify-between items-center">
              <legend className="fieldset-legend">
                Lahtiolekuajad nädalavahetusel (L–P)
              </legend>

              {/* From */}
              <div className="w-5/12">
                <p className="lael">Alates:</p>

                <input type="time" className="input" name="weekendHoursFrom" />
              </div>

              {/* To */}
              <div className="w-5/12">
                <p className="lael">Kuni:</p>

                <input type="time" className="input" name="weekendHoursTo" />
              </div>
            </fieldset>
          </Form>

          {/* Options */}
          <div className="w-full flex justify-between items-center mt-10">
            <div className="modal-action mt-0">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">
                  <ArrowLeft /> Tagasi
                </button>
              </form>
            </div>

            <button form="newLocationForm" className="btn btn-primary">
              Lisa
            </button>
          </div>
        </div>
      </dialog>

      {/* Confirm delete location modal */}
      <dialog
        onCancel={() => {
          setLocationToDelete(null);
        }}
        ref={deleteLocationModalRef}
        className="modal"
      >
        {locationToDelete ? (
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">
              Kas soovite selle müügikoha kindlasti kustutada?
            </h3>

            <div className="w-full flex justify-between items-end mt-5">
              {/* Cancel */}
              <div className="modal-action">
                <form method="dialog">
                  <button
                    onClick={() => setLocationToDelete(null)}
                    className="btn"
                  >
                    <ArrowLeft /> Tagasi
                  </button>
                </form>
              </div>

              {/* Confirm */}
              <Form method="DELETE" action=".">
                <input
                  type="hidden"
                  name="itemToDelete"
                  value={locationToDelete}
                />

                <button className="btn btn-error">Kustuta</button>
              </Form>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
};

export default DashboardManageLocation;
