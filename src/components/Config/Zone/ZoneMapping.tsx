import { Button, Divider, Modal } from "antd";
import React, { useState } from "react";
import { LocationListings } from "../Location/LocationListings";
import { ZoneSelector } from "./ZoneSelector";

export interface ZoneMappingProps {}

export const ZoneMapping: React.FC<ZoneMappingProps> = ({}) => {
  const [visible, setVisible] = useState(false);
  const [zoneId, setZoneId] = useState<null | number>(null);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        htmlType="button"
        size="middle"
        onClick={() => setVisible(true)}
        className="primaryButton"
      >
        Zone Mapping
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Zone Mapping"
      >
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: ".5rem" }}>
            <ZoneSelector setZoneId={setZoneId} width="100%" />
            {zoneId && (
              <div style={{ marginTop: "1rem" }}>
                <LocationListings zoneId={zoneId} selectedZoneId={zoneId} />
              </div>
            )}
          </div>
          <Divider
            type="vertical"
            style={{
              height: "auto",
            }}
          />
          <div style={{ flex: 1, padding: ".5rem" }}>
            <div>Unmapped Locations</div>
            <div style={{ marginTop: "1.6rem" }}>
              <LocationListings zoneId={null} selectedZoneId={zoneId} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
