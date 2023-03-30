import { useMutation } from "@apollo/client";
import { Button, Col, Form, message, Modal, Row, Tooltip } from "antd";
import { useForm } from "antd/lib/form/Form";
import { memo, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { UPDATE_ENTITY_BRAND } from "../../../api/mutations";
import { BrandSelector } from "../../../components/Config/Brand/BrandSelector";
import { errorMessage } from "../../../helpers/gql";
import { Entity } from "../../../models/Entity/Entity";
import classes from "./EditEntityDivision.module.css";

const EditEntityBrand = ({ entity }: { entity: Entity }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();
  const [brandId, setBrandId] = useState<number | null>(null);

  const [updateEntityBrand, { loading: loadingEntity }] = useMutation(
    UPDATE_ENTITY_BRAND,
    {
      onCompleted: () => {
        message.success("Successfully updated entity's brand.");
        handleCancel();
      },
      onError: (error) => {
        errorMessage(error, "Unexpected error while updating entity's brand.");
      },
      refetchQueries: ["getAllEntity"],
    }
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: any) => {
    updateEntityBrand({
      variables: {
        entityId: entity.id,
        brandId: brandId,
      },
    });
  };

  return (
    <div className={classes["info-edit"]}>
      <FaRegEdit onClick={() => setVisible(true)} />
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={`Update brand`}
        width="90vw"
        style={{ maxWidth: 700 }}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          id="myForm"
        >
          <div className={classes["row"]}>
            <div className={classes["col"]}>
              <Form.Item label="Brand" name="brand" required={false}>
                <BrandSelector
                  currentId={entity?.brand?.id}
                  currentName={entity?.brand?.name}
                  setBrandId={setBrandId}
                />
              </Form.Item>
            </div>
          </div>
          <Row justify="end" gutter={16}>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="ghost"
                  onClick={handleCancel}
                  className="secondaryButton"
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadingEntity}
                  className="primaryButton"
                >
                  Edit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(EditEntityBrand);
