import React, {FC, useContext, useEffect} from "react";
import CorePageTemplate from "../core/CorePage.template";
import MeterFormComponent from "../MeterForm.component";
import {Metering} from "../../models/meteringpoint.model";
import EegWebContentPaneComponent from "../EegWebContentPane.component";
import {IonButton, IonFooter, IonToolbar} from "@ionic/react";
import {ParticipantContext} from "../../store/hook/ParticipantProvider";
import EegPaneTemplate from "../core/EegPane.template";
import MeterFormElement from "../core/MeterForm.element";
import {useForm} from "react-hook-form";
import {
  participantsSelector,
  registerMeteringpoint,
  selectedParticipantSelector,
  updateMeteringPoint
} from "../../store/participant";
import {EegParticipant} from "../../models/members.model";
import {useAppDispatch, useAppSelector} from "../../store";
import {ratesSelector} from "../../store/rate";
import {selectedTenant} from "../../store/eeg";


const AddMeterPaneComponent: FC = () => {

  const dispatcher = useAppDispatch()
  const rates = useAppSelector(ratesSelector);
  const tenant = useAppSelector(selectedTenant);
  const participant = useAppSelector(selectedParticipantSelector);

  const meter = {status: "NEW", participantId: "", meteringPoint: ""} as Metering

  const {handleSubmit, control, formState: {errors, isDirty}, reset} = useForm<Metering>({mode: 'onBlur', defaultValues: meter});

  useEffect(() => {
    reset(meter)
  }, [participant])

  const {
    setShowAddMeterPane,
  } = useContext(ParticipantContext);

  const onChancel = () => {
    reset(meter)
    setShowAddMeterPane(false);
  }

  const onSubmit = (meter: Metering) => {
    if (isDirty) {
      let participantId = participant.id;
      meter.participantId = participantId

      dispatcher(registerMeteringpoint({tenant, participantId, meter}))
      reset(meter);
    }
  }
  return (
    <EegWebContentPaneComponent>
      <CorePageTemplate>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <EegPaneTemplate>
            <MeterFormElement control={control} rates={rates} errors={errors}/>
          </EegPaneTemplate>
        </form>
      </CorePageTemplate>
      <IonFooter>
        <IonToolbar className={"ion-padding-horizontal"}>
          <IonButton fill="clear" slot="start" onClick={onChancel}>Zurück</IonButton>
          <IonButton form="submit-register-meter" type="submit" slot="end">Registrieren</IonButton>
        </IonToolbar>
      </IonFooter>
    </EegWebContentPaneComponent>
  )
}

export default AddMeterPaneComponent;