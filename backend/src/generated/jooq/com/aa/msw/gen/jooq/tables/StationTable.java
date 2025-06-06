/*
 * This file is generated by jOOQ.
 */
package com.aa.msw.gen.jooq.tables;


import com.aa.msw.gen.jooq.Keys;
import com.aa.msw.gen.jooq.Public;
import com.aa.msw.gen.jooq.tables.records.StationTableRecord;

import java.util.Collection;
import java.util.UUID;

import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.Name;
import org.jooq.PlainSQL;
import org.jooq.QueryPart;
import org.jooq.SQL;
import org.jooq.Schema;
import org.jooq.Select;
import org.jooq.Stringly;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class StationTable extends TableImpl<StationTableRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>public.station_table</code>
     */
    public static final StationTable STATION_TABLE = new StationTable();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<StationTableRecord> getRecordType() {
        return StationTableRecord.class;
    }

    /**
     * The column <code>public.station_table.db_id</code>.
     */
    public final TableField<StationTableRecord, UUID> DB_ID = createField(DSL.name("db_id"), SQLDataType.UUID.nullable(false), this, "");

    /**
     * The column <code>public.station_table.stationid</code>.
     */
    public final TableField<StationTableRecord, Integer> STATIONID = createField(DSL.name("stationid"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>public.station_table.label</code>.
     */
    public final TableField<StationTableRecord, String> LABEL = createField(DSL.name("label"), SQLDataType.VARCHAR(255), this, "");

    /**
     * The column <code>public.station_table.latitude</code>.
     */
    public final TableField<StationTableRecord, Double> LATITUDE = createField(DSL.name("latitude"), SQLDataType.DOUBLE, this, "");

    /**
     * The column <code>public.station_table.longitude</code>.
     */
    public final TableField<StationTableRecord, Double> LONGITUDE = createField(DSL.name("longitude"), SQLDataType.DOUBLE, this, "");

    private StationTable(Name alias, Table<StationTableRecord> aliased) {
        this(alias, aliased, (Field<?>[]) null, null);
    }

    private StationTable(Name alias, Table<StationTableRecord> aliased, Field<?>[] parameters, Condition where) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table(), where);
    }

    /**
     * Create an aliased <code>public.station_table</code> table reference
     */
    public StationTable(String alias) {
        this(DSL.name(alias), STATION_TABLE);
    }

    /**
     * Create an aliased <code>public.station_table</code> table reference
     */
    public StationTable(Name alias) {
        this(alias, STATION_TABLE);
    }

    /**
     * Create a <code>public.station_table</code> table reference
     */
    public StationTable() {
        this(DSL.name("station_table"), null);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Public.PUBLIC;
    }

    @Override
    public UniqueKey<StationTableRecord> getPrimaryKey() {
        return Keys.STATION_TABLE_PKEY;
    }

    @Override
    public StationTable as(String alias) {
        return new StationTable(DSL.name(alias), this);
    }

    @Override
    public StationTable as(Name alias) {
        return new StationTable(alias, this);
    }

    @Override
    public StationTable as(Table<?> alias) {
        return new StationTable(alias.getQualifiedName(), this);
    }

    /**
     * Rename this table
     */
    @Override
    public StationTable rename(String name) {
        return new StationTable(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public StationTable rename(Name name) {
        return new StationTable(name, null);
    }

    /**
     * Rename this table
     */
    @Override
    public StationTable rename(Table<?> name) {
        return new StationTable(name.getQualifiedName(), null);
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public StationTable where(Condition condition) {
        return new StationTable(getQualifiedName(), aliased() ? this : null, null, condition);
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public StationTable where(Collection<? extends Condition> conditions) {
        return where(DSL.and(conditions));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public StationTable where(Condition... conditions) {
        return where(DSL.and(conditions));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public StationTable where(Field<Boolean> condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public StationTable where(SQL condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public StationTable where(@Stringly.SQL String condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public StationTable where(@Stringly.SQL String condition, Object... binds) {
        return where(DSL.condition(condition, binds));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public StationTable where(@Stringly.SQL String condition, QueryPart... parts) {
        return where(DSL.condition(condition, parts));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public StationTable whereExists(Select<?> select) {
        return where(DSL.exists(select));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public StationTable whereNotExists(Select<?> select) {
        return where(DSL.notExists(select));
    }
}
