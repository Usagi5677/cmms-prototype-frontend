import { Button, Collapse, Divider, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { FilterOptionProps } from "../../../models/Enums";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import { ZoneSelector } from "../../Config/Zone/ZoneSelector";
import { AssignedOrNotCheckbox } from "../AssignedOrNotCheckbox";
import { BrandSelector } from "../BrandSelector";
import { DepartmentSelector } from "../DepartmentSelector";
import { EngineSelector } from "../EngineSelector";
import EntityStatusFilter from "../EntityStatusFilter";
import { EntityTypeSelector } from "../EntityTypeSelector";
import { MeasurementSelector } from "../MeasurementSelector";
import Search from "../Search";

import classes from "./FilterOptions.module.css";

const FilterOptions = ({
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
                  <div className={classes["title"]}>Entity</div>
                  <Divider style={{ marginTop: 10 }} />
                  {disposedView ? (
                    <div className={classes["item"]}>
                      <Form.Item
                        name="entityType"
                        initialValue={options?.entityTypeOptions!.value}
                      >
                        <EntityTypeSelector
                          onChange={options?.entityTypeOptions!.onChange}
                          multiple={true}
                          rounded={true}
                          width={options?.entityTypeOptions!.width}
                          value={options?.entityTypeOptions!.value}
                        />
                      </Form.Item>
                    </div>
                  ) : (
                    <div className={classes["item"]}>
                      <Form.Item
                        name="status"
                        initialValue={options?.entityStatusOptions!.value}
                      >
                        <EntityStatusFilter
                          onChange={options?.entityStatusOptions!.onChange}
                          value={options?.entityStatusOptions!.value!}
                          multiple={true}
                          width={options?.entityStatusOptions!.width}
                        />
                      </Form.Item>
                    </div>
                  )}

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
                      name="brand"
                      initialValue={options?.brandOptions!.value}
                    >
                      <BrandSelector
                        onChange={options?.brandOptions!.onChange}
                        multiple={true}
                        rounded={true}
                        width={options?.brandOptions!.width}
                        value={options?.brandOptions!.value}
                      />
                    </Form.Item>
                  </div>
                  <div className={classes["item"]}>
                    <Form.Item
                      name="engine"
                      initialValue={options?.engineOptions!.value}
                    >
                      <EngineSelector
                        onChange={options?.engineOptions!.onChange}
                        multiple={true}
                        rounded={true}
                        width={options?.engineOptions!.width!}
                        value={options?.engineOptions!.value}
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
                      name="department"
                      initialValue={options?.departmentOptions!.value}
                    >
                      <DepartmentSelector
                        onChange={options?.departmentOptions!.onChange}
                        multiple={true}
                        rounded={true}
                        width={options?.departmentOptions!.width!}
                        value={options?.departmentOptions!.value}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className={classes["item-wrapper"]}>
                  <div className={classes["title"]}>Assigned</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["item"]}>
                    <Form.Item
                      name="assigned"
                      initialValue={options?.assignedOptions!.flag}
                    >
                      <AssignedOrNotCheckbox
                        onChange={options?.assignedOptions!.onChange}
                        name={options?.assignedOptions!.name}
                        flag={options?.assignedOptions!.flag}
                      />
                    </Form.Item>
                  </div>
                  <div className={classes["item"]}>
                    <Form.Item
                      name="incompleteChecklistTask"
                      initialValue={
                        options?.isIncompleteChecklistTaskOptions!.flag
                      }
                    >
                      <AssignedOrNotCheckbox
                        onChange={
                          options?.isIncompleteChecklistTaskOptions!.onChange
                        }
                        name={options?.isIncompleteChecklistTaskOptions!.name}
                        flag={options?.isIncompleteChecklistTaskOptions!.flag}
                      />
                    </Form.Item>
                  </div>
                  {/*
                  <div className={classes["item"]}>
                    <Form.Item name="assignedToMe">
                      <AssignedOrNotCheckbox
                        onChange={options?.assignedToMeOptions!.onChange}
                        name={options?.assignedToMeOptions!.name}
                      />
                    </Form.Item>
                  </div>
                  */}
                </div>

                <div className={classes["item-wrapper"]}>
                  <div className={classes["title"]}>Current Running</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["reading-container"]}>
                    <div className={classes["reading-wrapper"]}>
                      <div className={classes["sub-title"]}>Greater than</div>
                      <Search
                        searchValue={
                          options?.gteCurrentRunningOptions!.searchValue!
                        }
                        onChange={options?.gteCurrentRunningOptions!.onChange!}
                        onClick={options?.gteCurrentRunningOptions!.onClick!}
                        width={options?.gteCurrentRunningOptions!.width}
                        noIcon={true}
                        name={"Current running"}
                      />
                    </div>
                    <div className={classes["reading-wrapper"]}>
                      <div className={classes["sub-title"]}>Less than</div>
                      <Search
                        searchValue={
                          options?.lteCurrentRunningOptions!.searchValue!
                        }
                        onChange={options?.lteCurrentRunningOptions!.onChange!}
                        onClick={options?.lteCurrentRunningOptions!.onClick!}
                        width={options?.lteCurrentRunningOptions!.width}
                        noIcon={true}
                        name={"Current running"}
                      />
                    </div>
                  </div>
                </div>

                <div className={classes["item-wrapper"]}>
                  <div className={classes["title"]}>Last Service</div>
                  <Divider style={{ marginTop: 10 }} />
                  <div className={classes["reading-container"]}>
                    <div className={classes["reading-wrapper"]}>
                      <div className={classes["sub-title"]}>Greater than</div>
                      <Search
                        searchValue={
                          options?.gteLastServiceOptions!.searchValue!
                        }
                        onChange={options?.gteLastServiceOptions!.onChange!}
                        onClick={options?.gteLastServiceOptions!.onClick!}
                        width={options?.gteLastServiceOptions!.width}
                        noIcon={true}
                        name={"Last service"}
                      />
                    </div>
                    <div className={classes["reading-wrapper"]}>
                      <div className={classes["sub-title"]}>Less than</div>
                      <Search
                        searchValue={
                          options?.lteLastServiceOptions!.searchValue!
                        }
                        onChange={options?.lteLastServiceOptions!.onChange!}
                        onClick={options?.lteLastServiceOptions!.onClick!}
                        width={options?.lteLastServiceOptions!.width}
                        noIcon={true}
                        name={"Last service"}
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

export default FilterOptions;
