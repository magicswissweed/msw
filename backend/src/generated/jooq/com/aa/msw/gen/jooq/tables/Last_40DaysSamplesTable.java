/*
 * This file is generated by jOOQ.
 */
package com.aa.msw.gen.jooq.tables;


import com.aa.msw.gen.jooq.Keys;
import com.aa.msw.gen.jooq.Public;
import com.aa.msw.gen.jooq.tables.records.Last_40DaysSamplesTableRecord;

import java.util.Collection;
import java.util.UUID;

import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.JSONB;
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
public class Last_40DaysSamplesTable extends TableImpl<Last_40DaysSamplesTableRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>public.last_40_days_samples_table</code>
     */
    public static final Last_40DaysSamplesTable LAST_40_DAYS_SAMPLES_TABLE = new Last_40DaysSamplesTable();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<Last_40DaysSamplesTableRecord> getRecordType() {
        return Last_40DaysSamplesTableRecord.class;
    }

    /**
     * The column <code>public.last_40_days_samples_table.db_id</code>.
     */
    public final TableField<Last_40DaysSamplesTableRecord, UUID> DB_ID = createField(DSL.name("db_id"), SQLDataType.UUID.nullable(false), this, "");

    /**
     * The column <code>public.last_40_days_samples_table.station_id</code>.
     */
    public final TableField<Last_40DaysSamplesTableRecord, Integer> STATION_ID = createField(DSL.name("station_id"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column
     * <code>public.last_40_days_samples_table.last40dayssamples</code>.
     */
    public final TableField<Last_40DaysSamplesTableRecord, JSONB> LAST40DAYSSAMPLES = createField(DSL.name("last40dayssamples"), SQLDataType.JSONB.nullable(false), this, "");

    private Last_40DaysSamplesTable(Name alias, Table<Last_40DaysSamplesTableRecord> aliased) {
        this(alias, aliased, (Field<?>[]) null, null);
    }

    private Last_40DaysSamplesTable(Name alias, Table<Last_40DaysSamplesTableRecord> aliased, Field<?>[] parameters, Condition where) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table(), where);
    }

    /**
     * Create an aliased <code>public.last_40_days_samples_table</code> table
     * reference
     */
    public Last_40DaysSamplesTable(String alias) {
        this(DSL.name(alias), LAST_40_DAYS_SAMPLES_TABLE);
    }

    /**
     * Create an aliased <code>public.last_40_days_samples_table</code> table
     * reference
     */
    public Last_40DaysSamplesTable(Name alias) {
        this(alias, LAST_40_DAYS_SAMPLES_TABLE);
    }

    /**
     * Create a <code>public.last_40_days_samples_table</code> table reference
     */
    public Last_40DaysSamplesTable() {
        this(DSL.name("last_40_days_samples_table"), null);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : Public.PUBLIC;
    }

    @Override
    public UniqueKey<Last_40DaysSamplesTableRecord> getPrimaryKey() {
        return Keys.LAST_40_DAYS_SAMPLES_TABLE_PKEY;
    }

    @Override
    public Last_40DaysSamplesTable as(String alias) {
        return new Last_40DaysSamplesTable(DSL.name(alias), this);
    }

    @Override
    public Last_40DaysSamplesTable as(Name alias) {
        return new Last_40DaysSamplesTable(alias, this);
    }

    @Override
    public Last_40DaysSamplesTable as(Table<?> alias) {
        return new Last_40DaysSamplesTable(alias.getQualifiedName(), this);
    }

    /**
     * Rename this table
     */
    @Override
    public Last_40DaysSamplesTable rename(String name) {
        return new Last_40DaysSamplesTable(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Last_40DaysSamplesTable rename(Name name) {
        return new Last_40DaysSamplesTable(name, null);
    }

    /**
     * Rename this table
     */
    @Override
    public Last_40DaysSamplesTable rename(Table<?> name) {
        return new Last_40DaysSamplesTable(name.getQualifiedName(), null);
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public Last_40DaysSamplesTable where(Condition condition) {
        return new Last_40DaysSamplesTable(getQualifiedName(), aliased() ? this : null, null, condition);
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public Last_40DaysSamplesTable where(Collection<? extends Condition> conditions) {
        return where(DSL.and(conditions));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public Last_40DaysSamplesTable where(Condition... conditions) {
        return where(DSL.and(conditions));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public Last_40DaysSamplesTable where(Field<Boolean> condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public Last_40DaysSamplesTable where(SQL condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public Last_40DaysSamplesTable where(@Stringly.SQL String condition) {
        return where(DSL.condition(condition));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public Last_40DaysSamplesTable where(@Stringly.SQL String condition, Object... binds) {
        return where(DSL.condition(condition, binds));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    @PlainSQL
    public Last_40DaysSamplesTable where(@Stringly.SQL String condition, QueryPart... parts) {
        return where(DSL.condition(condition, parts));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public Last_40DaysSamplesTable whereExists(Select<?> select) {
        return where(DSL.exists(select));
    }

    /**
     * Create an inline derived table from this table
     */
    @Override
    public Last_40DaysSamplesTable whereNotExists(Select<?> select) {
        return where(DSL.notExists(select));
    }
}
