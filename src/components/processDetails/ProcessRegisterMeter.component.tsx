import React, {FC, forwardRef, useEffect, useState} from "react";
import {IonButton, IonInput, IonItem} from "@ionic/react";
import InputForm from "../form/InputForm.component";
import SelectForm from "../form/SelectForm.component";
import {useForm} from "react-hook-form";
import {Metering} from "../../models/meteringpoint.model";
import {EdaProcess, Eeg} from "../../models/eeg.model";
import {EegParticipant} from "../../models/members.model";
import CorePageTemplate from "../core/CorePage.template";
import ProcessHeaderComponent from "./ProcessHeader.component";
import ProcessContentComponent from "./ProcessContent.component";
import {Api} from "../../service";
import {BasicSelectComponent} from "../form/BasicSelect.component";
import {JoinStrings} from "../../util/Helper.util";
import {meteringDisplayName} from "../../util/FilterHelper";
import {useLocale} from "../../store/hook/useLocale";
import CheckboxComponent from "../form/Checkbox.component";
import InputComponent from "../form/Input.component";

interface ProcessValues {
  communityId: string | undefined
  participantId: string | undefined
  meteringPoint: string | undefined
  activationMode: 'ONLINE' | 'OFFLINE'
  activationCode: string | undefined
}

interface ProcessRegisterMeterComponentProps {
  eeg: Eeg
  meters: Metering[]
  participants: EegParticipant[]
  edaProcess: EdaProcess
}

const ProcessRegisterMeterComponent: FC<ProcessRegisterMeterComponentProps> = ({
                                                                                 eeg,
                                                                                 meters,
                                                                                 participants,
                                                                                 edaProcess
                                                                               }) => {
  const processValues = {
    communityId: eeg.communityId,
    participantId: undefined,
    meteringPoint: undefined,
    activationMode: 'ONLINE' as 'ONLINE' | 'OFFLINE',
    activationCode: undefined,
  }

  const {t} = useLocale("common")
  const {
    handleSubmit, reset,
    control, watch,
    setValue, formState
  } = useForm<ProcessValues>({defaultValues: processValues})
  const [useableMeters, setUsableMeters] = useState<Metering[]>(meters)
  const [meteringPoint, participantId] = watch(['meteringPoint', 'participantId'])
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (meteringPoint) {
      const p = participants.find(p => p.meters.find(m => m.meteringPoint === meteringPoint))
      if (p) {
        setValue('participantId', p.id)
      }
    }
  }, [meteringPoint])

  useEffect(() => {
    if (participantId) {
      const p = participants.find(p => p.id === participantId)
      if (p) {
        setUsableMeters(p.meters)
      }
    } else {
      setUsableMeters(meters)
    }
  }, [participantId])

  const onRequest = (data: ProcessValues) => {
    console.log("data", data, "participants", participants)
    if (data.meteringPoint) {
      const p = participants.find(p => p.meters.find(m => m.meteringPoint === data.meteringPoint))
      const meter = p?.meters.find(m => m.meteringPoint === data.meteringPoint)
      if (p && meter) {
        Api.eegService.registerMeteringPoint(eeg.id.toUpperCase(), p.id, data.meteringPoint, meter.direction, offline ? 'OFFLINE' : 'ONLINE', data.activationCode)
          .finally(() => {
            reset()
          })
      } else {
        console.log("p", p, "meter", meter, "data", data, "participants", participants)
      }
    } else {
      console.log("DATA:", data)
    }
  }

  const Component = forwardRef<HTMLIonInputElement, {}>(function CustomInput(p, ref) {
    return (
      <IonInput
        {...p}
        label={t("button_labels.calendar")}
        placeholder="Enter text"
        fill="outline"
        labelPlacement={"floating"}
        ref={ref}
      >
      </IonInput>
    );
  });

  return (
    <>
      <ProcessHeaderComponent name={edaProcess.name}/>
      <ProcessContentComponent>
        <CorePageTemplate>
          <>
            <InputForm name="communityId" label={t("communityId")} control={control} protectedControl={true}/>
            {/*<SelectForm control={control} name={"participantId"} options={participants.map((p) => {*/}
            {/*  return {key: p.id, value: p.firstname + " " + p.lastname}*/}
            {/*})} label={"Mitglied"} selectInterface={"popover"} rules={{required: true}}/>*/}
            {/*<SelectForm control={control} name={"meteringPoint"} options={useableMeters.map((p) => {*/}
            {/*  return {key: p.meteringPoint, value: p.meteringPoint + " (" + p.equipmentName + ")"}*/}
            {/*})} label={"Zählpunkt"} selectInterface={"popover"}  rules={{required: true}}/>*/}

            <BasicSelectComponent control={control} name={"participantId"}
                                  options={participants.sort((a, b) => a.lastname.localeCompare(b.lastname)).map((p) => {
                                    return {
                                      value: p.id,
                                      label: JoinStrings(" ", "-", p.participantNumber, p.lastname, p.firstname)
                                    }
                                  })} label={t("participant")}/>
            <BasicSelectComponent control={control} name={"meteringPoint"}
                                  options={useableMeters.filter(p => p.status !== 'ACTIVE' /*&& p.status !== 'APPROVED' && p.status !== 'PENDING'*/).map((p) => {
                                    return {
                                      value: p.meteringPoint,
                                      label: JoinStrings(" ", "", meteringDisplayName(p), p.status)
                                    }
                                  })} label={t("metering")} rules={{required: true}}/>

            <CheckboxComponent label={"Offline Registrierung"} checked={offline} setChecked={setOffline}></CheckboxComponent>
            { offline && 
              <InputForm name="activationCode" control={control} label={"Aktivierungs-Code"} counter={true} maxlength={33}/>
            }
            <IonItem lines="none" style={{zIndex: "0"}}>
              <IonButton slot="end" onClick={handleSubmit(onRequest)} disabled={!formState.isValid}>
                {t("process.submit")}
              </IonButton>
            </IonItem>
          </>
        </CorePageTemplate>
      </ProcessContentComponent>
    </>
  )
}

export default ProcessRegisterMeterComponent