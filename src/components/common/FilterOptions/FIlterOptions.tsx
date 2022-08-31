import { Button, Divider, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FilterOptionProps } from "../../../models/Enums";
import { LocationSelector } from "../../Config/Location/LocationSelector";
import { TypeSelector } from "../../Config/Type/TypeSelector";
import { AssignedOrNotCheckbox } from "../AssignedOrNotCheckbox";
import { BrandSelector } from "../BrandSelector";
import { DepartmentSelector } from "../DepartmentSelector";
import { EngineSelector } from "../EngineSelector";
import EntityStatusFilter from "../EntityStatusFilter";
import { MeasurementSelector } from "../MeasurementSelector";
import Search from "../Search";
import { ZoneSelector } from "../ZoneSelector";
import classes from "./FilterOptions.module.css";

const FilterOptions = ({
  options,
  onClick,
}: {
  options?: FilterOptionProps;
  onClick?: () => void;
}) => {
  const [form] = useForm();
  const handleCancel = () => {
    form.resetFields();
    onClick!();
  };
  return (
    <div className={classes["container"]}>
      <Form form={form} layout="vertical" name="basic" id="myForm">
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
          <Search
            searchValue={options?.searchOptions!.searchValue!}
            onChange={options?.searchOptions!.onChange!}
            onClick={options?.searchOptions!.onClick!}
            width={options?.searchOptions!.width}
          />
        </div>

        <div className={classes["item-container"]}>
          <div className={classes["item-wrapper"]}>
            <div className={classes["title"]}>Entity</div>
            <Divider style={{ marginTop: 10 }} />
            <div className={classes["item"]}>
              <Form.Item name="status">
                <EntityStatusFilter
                  onChange={options?.entityStatusOptions!.onChange}
                  value={options?.entityStatusOptions!.value!}
                  multiple={true}
                  width={options?.entityStatusOptions!.width}
                />
              </Form.Item>
            </div>
            <div className={classes["item"]}>
              <Form.Item name="type">
                <TypeSelector
                  entityType={options?.typeSelectorOptions!.entityType}
                  setTypeId={options?.typeSelectorOptions!.setTypeId}
                  rounded={options?.typeSelectorOptions!.rounded}
                  multiple={options?.typeSelectorOptions!.multiple}
                  width={options?.typeSelectorOptions!.width}
                />
              </Form.Item>
            </div>
            <div className={classes["item"]}>
              <Form.Item name="brand">
                <BrandSelector
                  onChange={options?.brandOptions!.onChange}
                  multiple={true}
                  rounded={true}
                  width={options?.brandOptions!.width}
                />
              </Form.Item>
            </div>
            <div className={classes["item"]}>
              <Form.Item name="engine">
                <EngineSelector
                  onChange={options?.engineOptions!.onChange}
                  multiple={true}
                  rounded={true}
                  width={options?.engineOptions!.width!}
                />
              </Form.Item>
            </div>
            <div className={classes["item"]}>
              <Form.Item name="measurement">
                <MeasurementSelector
                  onChange={options?.measurementOptions!.onChange}
                  rounded={true}
                  width={options?.measurementOptions!.width!}
                  multiple
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["item-wrapper"]}>
            <div className={classes["title"]}>Location</div>
            <Divider style={{ marginTop: 10 }} />
            <div className={classes["item"]}>
              <Form.Item name="location">
                <LocationSelector
                  setLocationId={options?.locationOptions!.setLocationId}
                  multiple={true}
                  rounded={true}
                  width={options?.locationOptions!.width}
                />
              </Form.Item>
            </div>
            <div className={classes["item"]}>
              <Form.Item name="zone">
                <ZoneSelector
                  onChange={options?.zoneOptions!.onChange}
                  multiple={true}
                  rounded={true}
                  width={options?.zoneOptions!.width}
                />
              </Form.Item>
            </div>
            <div className={classes["item"]}>
              <Form.Item name="department">
                <DepartmentSelector
                  onChange={options?.departmentOptions!.onChange}
                  multiple={true}
                  rounded={true}
                  width={options?.departmentOptions!.width}
                />
              </Form.Item>
            </div>
          </div>

          <div className={classes["item-wrapper"]}>
            <div className={classes["title"]}>Assigned</div>
            <Divider style={{ marginTop: 10 }} />
            <div className={classes["item"]}>
              <Form.Item name="assigned">
                <AssignedOrNotCheckbox
                  onChange={options?.assignedOptions!.onChange}
                  name={options?.assignedOptions!.name}
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
                <div className={classes["sub-title"]}>Greater than equal</div>
                <Search
                  searchValue={options?.gteCurrentRunningOptions!.searchValue!}
                  onChange={options?.gteCurrentRunningOptions!.onChange!}
                  onClick={options?.gteCurrentRunningOptions!.onClick!}
                  width={options?.gteCurrentRunningOptions!.width}
                  noIcon={true}
                  name={"Current running"}
                />
              </div>
              <div className={classes["reading-wrapper"]}>
                <div className={classes["sub-title"]}>Less than equal</div>
                <Search
                  searchValue={options?.lteCurrentRunningOptions!.searchValue!}
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
                <div className={classes["sub-title"]}>Greater than equal</div>
                <Search
                  searchValue={options?.gteLastServiceOptions!.searchValue!}
                  onChange={options?.gteLastServiceOptions!.onChange!}
                  onClick={options?.gteLastServiceOptions!.onClick!}
                  width={options?.gteLastServiceOptions!.width}
                  noIcon={true}
                  name={"Last service"}
                />
              </div>
              <div className={classes["reading-wrapper"]}>
                <div className={classes["sub-title"]}>Less than equal</div>
                <Search
                  searchValue={options?.lteLastServiceOptions!.searchValue!}
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
  );
};

export default FilterOptions;
