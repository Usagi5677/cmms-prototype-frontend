import { Button, Collapse, DatePicker, Divider, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FilterOptionProps } from "../../../models/Enums";
import { DivisionSelector } from "../../Config/Division/DivisionSelector";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import { ZoneSelector } from "../../Config/Zone/ZoneSelector";
import PMStatusFilter from "../PMStatusFilter";
import { MeasurementSelector } from "../MeasurementSelector";
import Search from "../Search";
import classes from "./MaintenanceFIlterOptions.module.css";

const MaintenanceFilterOptions = ({
  options,
  onClick,
  disposedView,
}: {
  options?: FilterOptionProps;
  onClick?: () => void;
  disposedView?: boolean;
}) => {
  const [form] = useForm();

  const handleCancel = () => {
    onClick!();
    form.resetFields();

    //running 1 more time so that tags can dissapear
    setTimeout(function () {
      form.resetFields();
    }, 1000);
  };

  return (
    <div id="filterCollapse">
      <Collapse
        ghost
        className={classes["collapse-container"]}
        defaultActiveKey={"filter"}
      >
        <Collapse.Panel
          header={<div className={classes["header-title"]}>Filter</div>}
          key={"filter"}
        >
          <div className={classes["container"]}>
            <Form
              form={form}
              layout="vertical"
              name="basic"
              id="myForm"
              className={classes["form-container"]}
              preserve={false}
            >
              <Form.Item style={{ marginBottom: 20 }}>
                <Button
                  type="ghost"
                  onClick={handleCancel}
                  className="secondaryButton"
                  style={{width: "100%"}}
                >
                  Clear
                </Button>
              </Form.Item>
              <div className={classes["search"]}>
                <Form.Item
                  name="search"
                  initialValue={options?.searchOptions!.searchValue!}
                >
                  <Search
                    searchValue={options?.searchOptions!.searchValue!}
                    onChange={options?.searchOptions!.onChange!}
                    onClick={options?.searchOptions!.onClick!}
                    width={options?.searchOptions!.width}
                  />
                </Form.Item>
              </div>

              <div className={classes["item-container"]}>
                <div className={classes["item-wrapper"]}>
                  <div className={classes["title"]}>Maintenance</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["item"]}>
                    <Form.Item
                      name="pmStatus"
                      initialValue={options?.pmStatusOptions!.value}
                    >
                      <PMStatusFilter
                        onChange={options?.pmStatusOptions!.onChange}
                        value={options?.pmStatusOptions!.value!}
                        multiple={true}
                        width={options?.pmStatusOptions!.width}
                      />
                    </Form.Item>
                  </div>
                  <div className={classes["sub-title"]}>From</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["item"]}>
                    <Form.Item
                      name="from"
                      initialValue={options?.fromOptions!.value}
                    >
                      <DatePicker
                        onChange={options?.fromOptions!.onChange}
                        value={options?.fromOptions!.value!}
                        style={{width: "100%"}}
                      />
                    </Form.Item>
                  </div>
                  <div className={classes["sub-title"]}>To</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["item"]}>
                    <Form.Item
                      name="to"
                      initialValue={options?.toOptions!.value}
                    >
                      <DatePicker
                        onChange={options?.toOptions!.onChange}
                        value={options?.toOptions!.value!}
                        style={{width: "100%"}}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className={classes["item-wrapper"]}>
                  <div className={classes["title"]}>Entity</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["item"]}>
                    <Form.Item
                      name="type"
                      initialValue={options?.typeSelectorOptions!.currentId!}
                    >
                      <TypeSelector
                        entityType={options?.typeSelectorOptions!.entityType}
                        setTypeId={options?.typeSelectorOptions!.setTypeId}
                        currentId={options?.typeSelectorOptions!.currentId!}
                        rounded={options?.typeSelectorOptions!.rounded}
                        multiple={options?.typeSelectorOptions!.multiple}
                        width={options?.typeSelectorOptions!.width}
                      />
                    </Form.Item>
                  </div>

                  <div className={classes["item"]}>
                    <Form.Item
                      name="measurement"
                      initialValue={options?.measurementOptions!.value}
                    >
                      <MeasurementSelector
                        onChange={options?.measurementOptions!.onChange}
                        multiple
                        rounded={true}
                        width={options?.measurementOptions!.width!}
                        value={options?.measurementOptions!.value!}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className={classes["item-wrapper"]}>
                  <div className={classes["title"]}>Location</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["item"]}>
                    <Form.Item
                      name="location"
                      initialValue={options?.locationOptions!.currentId}
                    >
                      <LocationSelector
                        setLocationId={options?.locationOptions!.setId}
                        multiple={true}
                        rounded={true}
                        width={options?.locationOptions!.width}
                        currentId={options?.locationOptions!.currentId!}
                      />
                    </Form.Item>
                  </div>
                  <div className={classes["item"]}>
                    <Form.Item
                      name="zone"
                      initialValue={options?.zoneOptions!.currentId}
                    >
                      <ZoneSelector
                        setZoneId={options?.zoneOptions!.setId}
                        multiple={true}
                        rounded={true}
                        width={options?.zoneOptions!.width}
                        currentId={options?.zoneOptions!.currentId!}
                      />
                    </Form.Item>
                  </div>
                  <div className={classes["item"]}>
                    <Form.Item
                      name="division"
                      initialValue={options?.divisionOptions!.currentId}
                    >
                      <DivisionSelector
                        setDivisionId={options?.divisionOptions!.setId}
                        multiple={true}
                        rounded={true}
                        width={options?.divisionOptions!.width}
                        currentId={options?.divisionOptions!.currentId!}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className={classes["item-wrapper"]}>
                  <div className={classes["title"]}>Inter Service</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["reading-container"]}>
                    <div className={classes["reading-wrapper"]}>
                      <div className={classes["sub-title"]}>Greater than</div>
                      <Search
                        searchValue={
                          options?.gteInterServiceOptions!.searchValue!
                        }
                        onChange={options?.gteInterServiceOptions!.onChange!}
                        onClick={options?.gteInterServiceOptions!.onClick!}
                        width={options?.gteInterServiceOptions!.width}
                        noIcon={true}
                        name={"Inter service"}
                      />
                    </div>
                    <div className={classes["reading-wrapper"]}>
                      <div className={classes["sub-title"]}>Less than</div>
                      <Search
                        searchValue={
                          options?.lteInterServiceOptions!.searchValue!
                        }
                        onChange={options?.lteInterServiceOptions!.onChange!}
                        onClick={options?.lteInterServiceOptions!.onClick!}
                        width={options?.lteInterServiceOptions!.width}
                        noIcon={true}
                        name={"Inter service"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default MaintenanceFilterOptions;
